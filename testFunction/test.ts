import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient({region: "us-east-1"})
const tableName = "aws-journey"

interface TestBody {
   lab: string
   testParams: {
      [key: string]: string
   }
   credentialsLabel: string
}

interface TestParams {
   [key: string]: string
}

interface Credentials {
   credentials: {
      accessKeyId: string
      secret: string
   }
}

function validate (params: any[]) {
   params.forEach (param => {
      let [value, label] = param
      if (value == null) {
         throw `param ${label} not provided`
      }
   })
}

async function runTests(user: string, lab: string, testParams: TestParams, credentialsLabel: string) {
   let { credentials }: Credentials = await getCredentials(user, credentialsLabel) as Credentials

   const [testGroups, testData, labData] = await getLabData(lab)

   if (testData && testGroups && labData) {
      const { tag, testParams: params } = testData
      const { location } = labData
      const { testSuite } = await import(`./tests/${location}/${lab}`)
      if ( testParams == null ) {
         testParams = {}
      }
      let allParams = params.every((param: string) => testParams[param] != null)
      if (!allParams) {
         throw "Parameters missing in testParams"
      }
      const tests = new testSuite(
         testParams,
         { Key: "journey", Value: tag },
         {
            region: testParams.region,
            credentials: {
               id: credentials.accessKeyId,
               secret: credentials.secret
            }
         }
      )
      const testResult = await tests.run()
      console.log(JSON.stringify(testResult))
      return testResult
   } else {
      throw "internal error"
   }
}


export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
   try {
      const body: TestBody = getBody(event)
      const user = getUser(event)

      let { lab, testParams, credentialsLabel } = body
      validate([[lab, "lab"], [testParams, "testParams"], [credentialsLabel, "credentialsLabel"]])

      let tests = await runTests(user, lab, testParams, credentialsLabel)

      return {
         statusCode: 200,
         body: JSON.stringify({
            message: 'tests runned successfully',
            headers: {
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            tests,
         })
      }

   } catch (error) {
      return {
         statusCode: error.status || 400,
         body: JSON.stringify({
            message: error.message,
            headers: {
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            input: event,
         })
      }
   }   
}

async function getCredentials(user: string, credentialsLabel: string) {
   var params = {
      TableName : tableName,
      Key: {
        pk: `user_${user}#credentials`,
        sk: credentialsLabel
      }
    };
   let getCredentialsRequest = await dynamo.get(params).promise()
   if (getCredentialsRequest.Item == null) {
      throw "No credentials found"
   }
   return getCredentialsRequest.Item
}

async function getLabData(lab: string) {
   const dynamoRequest = await query(`lab_${lab}`)
   const records = dynamoRequest.Items

   const testGroups = records?.filter(record => record.sk.startsWith("testGroup"))
   const testData = records?.find(record => record.sk === "testData")
   const labData = records?.find(record => record.sk === "data")

   return [testGroups, testData, labData]
}

function includeAdditionalTestInfo(testGroups: any[], testResult: any) {
   console.log(JSON.stringify(testGroups))
   console.log(JSON.stringify(testResult))
}


async function query (key: string) {
   const pk = "pk"
   const params = {
      TableName: tableName,
      KeyConditionExpression: `${pk} = :pk`,
      ExpressionAttributeValues: {
         [`:${pk}`]: key
      }
   }
   return dynamo.query(params).promise()
}


function getUser(event: APIGatewayProxyEvent) {
   const authorizer: any = event.requestContext.authorizer
   return authorizer["claims"]["cognito:username"]
}
function getBody(event: APIGatewayProxyEvent) {
   return JSON.parse(event.body || "{}")
}

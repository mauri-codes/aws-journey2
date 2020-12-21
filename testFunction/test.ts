import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient()
const tableName = "aws-journey"

interface TestBody {
   lab: string
   testParams: {
      [key: string]: string
   }
}

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
   const body: TestBody = getBody(event)
   const user = getUser(event)
   let { lab, testParams} = body
   console.log(user, lab)
   console.log(testParams)

   const [testGroups, testData, labData] = await getLabData(lab)

   if (testData && testGroups && labData) {
      const { tag, testParams: params } = testData
      const { location } = labData
      const { testSuite } = await import(`./tests/${location}/${lab}`)
      if ( testParams != null ) {
         testParams = {}
      }
      let allParams = params.every((param: string) => testParams[param] != null)
      console.log("all Params -> " + allParams)
      const testSuiteParams = {
         ...testParams,
         tag: {Key: "journey", Value: tag}
      }
      const tests = new testSuite(testSuiteParams)
      const testResult = await tests.run()
      console.log(JSON.stringify(testResult))
   }

   return {
      statusCode: 200,
      body: JSON.stringify({
         message: 'Hello world 3',
         headers: {
               "Access-Control-Allow-Headers" : "Content-Type",
               "Access-Control-Allow-Origin": "*",
               "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
         },
         input: event,
      })
   }
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

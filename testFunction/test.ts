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

interface Test {
   id: string
   success: boolean
   message?: string
   error?: string
}

interface TestGroup {
   id: string
   success: boolean
   tests: Test[]
}

interface TestResults {
   success: boolean
   testGroups: TestGroup[]
}

function validate (params: any[]) {
   params.forEach (param => {
      let [value, label] = param
      if (value == null) {
         throw `param ${label} not provided`
      }
   })
}

const HEADERS = {
   "Access-Control-Allow-Headers" : "Content-Type",
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

async function runTests(user: string, lab: string, testParams: TestParams, credentialsLabel: string) {
   let { credentials }: Credentials = await getCredentials(user, credentialsLabel) as Credentials
   
   const [testGroups, testData, labData] = await getLabData(lab)
   console.log(JSON.stringify({testGroups, testData, labData}))

   if (testData && testGroups && labData) {      
      const { tag, testParams: params } = testData
      
      const { location } = labData
      const { testSuite } = await import(`./tests/${location}/${lab}`)
      if ( testParams == null ) {
         testParams = {}
      }
      let region = testParams.region
      let allParams = params.every((param: string) => testParams[param] != null)
      if (!allParams) {
         throw "Parameters missing in testParams"
      }
      let testArguments: any[] = [
         testParams
      ]
      if (tag !== "none") {
         testArguments.push({ Key: "journey", Value: tag })
      }
      testArguments.push({
            region,
            credentials: {
               id: credentials.accessKeyId,
               secret: credentials.secret
            }
         })
      const tests = new testSuite(...testArguments)
      console.log(JSON.stringify(testParams))
      console.log(JSON.stringify({ Key: "journey", Value: tag }))  

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
      console.log(JSON.stringify(body))
      console.log(user)

      let { lab, testParams, credentialsLabel } = body
      
      validate([[lab, "lab"], [testParams, "testParams"], [credentialsLabel, "credentialsLabel"]])
      
      let tests = await runTests(user, lab, testParams, credentialsLabel)

      await recordTests(user, lab, tests)
      
      return {
         statusCode: 200,
         body: JSON.stringify({
            message: 'tests runned successfully',
            tests
         }),
         headers: HEADERS
      }

   } catch (error) {
      console.log(error)
      return {
         statusCode: error.status || 400,
         body: JSON.stringify({
            message: error.message
         }),
         headers: HEADERS
      }
   }   
}

function getTestSummary(tests: TestResults) {
   let allTests = tests.testGroups.flatMap(testGroup => testGroup.tests)
   let successful = allTests.reduce((acc, test) => test.success ? acc+1: acc, 0)
   let total = allTests.length
   let failed = total - successful
   return { successful, failed, total }
}

async function recordTests(user: string, lab: string, tests: TestResults) {
   const currentTestSummary = getTestSummary(tests)
   const testRecordKey = {
      pk: `user_${user}#tests`,
      sk: `lab_${lab}`
   }
   let testRecord = await dynamo.get({
      TableName: tableName,
      Key: testRecordKey
   }).promise()

   const params = {
      TableName : tableName,
      Item: {
         ...testRecordKey,
         summary: currentTestSummary,
         tests
      }
   }
   if (testRecord.Item == null) {
      await dynamo.put(params).promise()
   } else {
      const {summary: {successful}} = testRecord.Item
      if (successful < currentTestSummary.successful) {
         await dynamo.put(params).promise()
      }
   }
   await saveLabStatus(tests.success, user, lab)
}

async function saveLabStatus(status: boolean, user: string, lab: string) {
   const params = {
      TableName : tableName,
      Item: {
         pk: `user_${user}#completed`,
         sk: `lab_${lab}`,
         status,
         user,
         lab
      }
   }
   if (status) {
      await dynamo.put(params).promise()
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

   const testGroups = records?.filter(record => record.sk.startsWith("testgroup"))
   const testData = records?.find(record => record.sk === "testData")
   const labData = records?.find(record => record.sk === "data")

   return [testGroups, testData, labData]
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

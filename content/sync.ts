import minimist from "minimist"
import { DynamoDB } from 'aws-sdk'
import path from "path"
import fs from "fs"
import { safeLoad as yamlLoad } from "js-yaml"

// ts-node sync.ts --lab=serverless/S3_static_website
// ts-node sync.ts --lab=identity/IAM_groups

const dynamo = new DynamoDB.DocumentClient({region: "us-east-1"})

interface Error {
   code: string
   message: string
}

interface Test {
   id: string
   errors: Error[]
}

interface TestGroup {
   id: string
   title: string
   tests: Test[]
   errors: Error[]
}

interface LabData {
   lab: string
   info: {
      title: string
      location: string
   }
   testData: {
      tag: string
      params: string[]
      permissions: string[]
   }
   overview: {
      Description: string
      Goals: string[]
      Services: string[]
   }
   testGroups: TestGroup[]
}

const args = minimist(process.argv.slice(2))


const labData: LabData = yamlLoad(fs.readFileSync(path.join(__dirname, `labs/${args.lab}.yaml`), 'utf8')) as LabData

const { lab, info, overview, testGroups, testData } = labData
const pk = `lab_${lab}`

const tests = testGroups.map(testGroup => ({
   pk, sk: `testgroup_${testGroup.id}`,
   ...testGroup
}))

const records = [{
   pk, sk: "data",
   ...info
}, {
   pk, sk: "overview",
   ...overview
}, {
   pk, sk: "testData",
   ...testData
},
...tests
]

const tableName = "aws-journey"

const DynamoDBrecords = records.map(record => {
   return {
      PutRequest: {
         Item: {
            ...record
         }
      }
   }
 })

const params = {
   RequestItems: {
      [tableName]: DynamoDBrecords
   }
}

async function updateRecords () {
   const result = await dynamo.batchWrite(params).promise()
   console.log(result)
}

updateRecords()


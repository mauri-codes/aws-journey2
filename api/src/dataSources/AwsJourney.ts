require("dotenv").config();
import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';

AWS.config.loadFromPath('./config.json')

const DynamoDB = AWS.DynamoDB
const dynamo = new DynamoDB.DocumentClient()

interface Lab {
   title?: string
   overview?: Overview
   testSection?: TestSection
}

interface Overview {
   description?: string
   goals?: string[]
   services?: string[]
}
interface TestSection {
   tests?: [string]
}

interface Record extends Overview, TestSection {
   pk?: string
   sk?: string
   title?: string
}

class AWSJourneyDataSource extends DataSource{
   private readonly tableName = 'aws-journey'
   private readonly pk = 'pk'
   async getLab(id: string) {
      let labData = {}
      const queryResult = (await this.query(`lab_${id}`))["Items"]
      let summaryLab = queryResult?.reduce((acc, item) => {
         let location
         if (item["sk"] == "overview") {
            location = "tests"
         } else if (item["sk"] == "overview") {
            location = "overview"
         } else {
            location = "data"
            item["id"] = id
         }
         delete item.sk
         delete item.pk
         acc[location] = item
         return acc
      }, {})
      if (summaryLab) {
         labData = (summaryLab["data"] || {});
      }
      const lab = {...summaryLab, ...labData}
      return lab
   }
   async updateLab(id: string, lab: Lab) {
      const pk = `lab_${id}`
      let { overview, testSection, ...labParams } = lab
      let labData
      if (Object.keys(lab).length == 0) {
         labData = undefined
      } else {
         labData = labParams
      }
      let records: (Record | undefined) [] = [overview, testSection, labData]
      let sks = ["overview", "tests", pk]
      records = records.flatMap((record, index) => {
            if (record == null) return []
            record["pk"] = pk
            record["sk"] = sks[index]
            return {
               ...record, sk: pk
            }
      })
      const result = await this.batchUpdate(records)
      console.log("----")
      console.log(result)
      return {...lab, id}
   }
   setPK(record:Record | undefined, pk:string, sk:string) {
      if (record) {
         record.pk = pk
         record.sk = sk
      }
      return record
   }
   async query (key: string) {
      // const attributeValues: any = {}
      // Object.entries(record).forEach(([key, value]) => {
      //    attributeValues[`:${key}`] = value
      // })
      const params = {
         TableName: this.tableName,
         KeyConditionExpression: `${this.pk} = :pk`,
         ExpressionAttributeValues: {
            [`:${this.pk}`]: key
         }
      }
      return dynamo.query(params).promise()
   }
   async batchUpdate(records:any[]) {
      records = records.map(record => {
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
            [this.tableName]: records
         }
      }
      return dynamo.batchWrite(params).promise()
      // async function UpdateItems(params: any) {
      //    return dynamoDB.batchWriteItem(params, function (err, data) {
      //       if(err) {
      //          console.log("error", JSON.stringify(err))
      //       }
      //       console.log(data)
      //       return data
      //    })
      // }
   }
}

export { AWSJourneyDataSource }

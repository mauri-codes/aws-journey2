import path from 'path'
import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
const fs = require('fs')

const configFile = '../../config.json'
try {
   if (fs.existsSync(path.join(__dirname, configFile))) {
      AWS.config.loadFromPath('./config.json')
   }
} catch(err) {
  console.error(err)
}


const DynamoDB = AWS.DynamoDB
const dynamo = new DynamoDB.DocumentClient({region: "us-east-1"})

export interface DynamoRecord {
   pk?: string
   sk?: string
}

class DynamoDataSource extends DataSource {
   tableName: string
   pk: string
   sk: string | undefined
   constructor(tableName: string, pk: string, sk?: string) {
      super()
      this.tableName = tableName
      this.pk = pk
      this.sk = sk
   }
   async query (key: string) {
      const params = {
         TableName: this.tableName,
         KeyConditionExpression: `${this.pk} = :pk`,
         ExpressionAttributeValues: {
            [`:${this.pk}`]: key
         }
      }
      let queryResult = (await dynamo.query(params).promise())["Items"]
      // if (queryResult && queryResult.length == 0) {
      //    throw 'No record found';
      // }
      return queryResult
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
   }
   async put(record: any) {
      const params = {
         TableName : this.tableName,
         Item: record
      }
      return dynamo.put(params).promise()
   }
   async delete(record: DynamoRecord) {
      const params = {
         TableName : this.tableName,
         Key: record
      };
      return dynamo.delete(params).promise()
   }
}

export { DynamoDataSource }

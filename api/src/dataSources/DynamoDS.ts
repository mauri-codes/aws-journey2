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
const dynamo = new DynamoDB.DocumentClient()

export interface DynamoRecord {
   pk?: string
   sk?: string
}

class DynamoDataSource extends DataSource {
   tableName
   pk
   sk
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
   }
}

export { DynamoDataSource }

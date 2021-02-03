import { DynamoDataSource, DynamoRecord } from "./DynamoDS"
import {  AwsCredentials, ResponseState } from "../generated/graphql"
import { Catch } from "../decorators";

type CredentialsRecord = DynamoRecord & {credentials: AwsCredentials}

class UserCredentialsSource extends DynamoDataSource {
   credentialsTag: string = "credentials"
   constructor() {
      super('aws-journey', 'pk')
   }
   @Catch
   async setAWSCredentials(credentials: AwsCredentials, user: string) {
      let record: CredentialsRecord = {
         pk: `user_${user}#${this.credentialsTag}`,
         sk: credentials.name || "main",
         credentials
      }
      await this.put(record)
      return {
         success: true
      }
   }
   @Catch
   async getAWSCredentials(user: string) {
      let queryResult = await this.query(`user_${user}#${this.credentialsTag}`)
      let credentialsGroup = (queryResult as CredentialsRecord[])?.map((record) => ({
         name: record.sk,
         accessKeyId: `${record.credentials.accessKeyId?.substring(0, 5)}****************`
      }))
      return {
         success: true,
         credentialsGroup
      }
   }
   @Catch
   async deleteAWSCredentials(credentials: AwsCredentials, user:string) {
      await this.delete({
         pk: `user_${user}#${this.credentialsTag}`,
         sk: credentials.name || "main"
      })
      return {
         success: true
      }
   }
}

export { UserCredentialsSource }

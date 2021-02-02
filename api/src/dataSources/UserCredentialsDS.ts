import { DynamoDataSource, DynamoRecord } from "./DynamoDS"
import {  AwsCredentials, ResponseState } from "../generated/graphql"
import { Catch } from "../decorators";

type CredentialsRecord = DynamoRecord & {credentials: AwsCredentials}

class UserCredentialsSource extends DynamoDataSource {
   constructor() {
      super('aws-journey', 'pk')
   }
   @Catch
   async setAWSCredentials(credentials: AwsCredentials, user: string) {
      let record: CredentialsRecord = {
         pk: `user_${user}#credentials`,
         sk: "main",
         credentials
      }
      await this.put(record)
      return {
         success: true
      }
   }
}

export { UserCredentialsSource }

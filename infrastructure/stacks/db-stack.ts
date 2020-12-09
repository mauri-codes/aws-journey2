import * as cdk from '@aws-cdk/core'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'

export class DBStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const table = new Table(this, 'AWSJourneyTable', {
         tableName: "aws-journey",
         partitionKey: { name: 'pk', type: AttributeType.STRING },
         sortKey: { name: 'sk', type: AttributeType.STRING },
         readCapacity: 10,
         writeCapacity: 10
      });
   }
}
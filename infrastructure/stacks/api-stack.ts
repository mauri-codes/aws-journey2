import * as path from 'path';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core'

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const fn = new Function(this, 'QueryProcessor', {
         functionName: "api-apollo-backend",
         runtime: Runtime.NODEJS_10_X,
         handler: 'graphql.graphqlHandler',
         code: Code.fromAsset(path.join(__dirname, '../../api/packaged')),
      });
   }
}

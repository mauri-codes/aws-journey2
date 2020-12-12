import * as path from 'path';
import * as cdk from '@aws-cdk/core'
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { 
   Effect,
   PolicyStatement
} from "@aws-cdk/aws-iam";
import { LambdaRestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer, Cors } from "@aws-cdk/aws-apigateway";
import { Table } from "@aws-cdk/aws-dynamodb";
import { IUserPool, UserPool } from "@aws-cdk/aws-cognito";


interface APIStackProps extends cdk.StackProps {
   userpool: IUserPool
}
export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: APIStackProps) {
      super(scope, id, props);
      const dynamoStatement = this.createDynamoDBStatement()
      const processor = this.createLambdaProcessor(dynamoStatement)
      const api = new LambdaRestApi(this, 'apollo-api', {
         handler: processor,
         proxy: false,
         defaultCorsPreflightOptions: {
           allowOrigins: Cors.ALL_ORIGINS,
           allowMethods: Cors.ALL_METHODS
         }
      });
      
      const cognitoAuthorizer = this.createCognitoAuthorizer(cdk.Token.asString(props?.userpool.userPoolArn), api)
      const lambdaIntegration = new LambdaIntegration(processor)
      const graphql = api.root.addResource('graphql')
      graphql.addMethod(
         "GET",
         lambdaIntegration,
         cognitoAuthorizer
      )
      graphql.addMethod(
         "POST",
         lambdaIntegration,
         cognitoAuthorizer
      )
      const internal = api.root.addResource('internal')
      internal.addMethod("GET")
      internal.addMethod("POST")      

   }
   createDynamoDBStatement() {
      const dynamoStatement = new PolicyStatement({effect: Effect.ALLOW})
      dynamoStatement.addActions(
         "dynamodb:BatchWriteItem",
         "dynamodb:UpdateItem",
         "dynamodb:GetItem",
         "dynamodb:PutItem",
         "dynamodb:Query"
      )
      dynamoStatement.addResources(
         Table.fromTableName(this, "aws-journey-table", "aws-journey").tableArn
      )
      return dynamoStatement
   }
   createLambdaProcessor(policyStatement: PolicyStatement) {
      const processor = new Function(this, 'QueryProcessor', {
         functionName: "api-apollo-backend",
         runtime: Runtime.NODEJS_10_X,
         handler: 'graphql.graphqlHandler',
         code: Code.fromAsset(path.join(__dirname, '../../api/packaged'))
      });
      processor.addToRolePolicy(policyStatement)
      return processor
   }
   createCognitoAuthorizer(userPoolArn: string, api: LambdaRestApi) {
      const userPool = UserPool.fromUserPoolArn(this, "userPool", userPoolArn)
      const cognitoAuthorizer = new CfnAuthorizer(this, "CognitoAuthorizer", {
         name: "CognitoAuthorizer",
         type: AuthorizationType.COGNITO,
         identitySource: 'method.request.header.Authorization',
         restApiId: api.restApiId,
         providerArns: [userPool.userPoolArn]
      });
      const cognitoAuthObject = {
         authorizer: {authorizerId: cognitoAuthorizer.ref},
         authorizationType: AuthorizationType.COGNITO
      }
      return cognitoAuthObject
   }
}

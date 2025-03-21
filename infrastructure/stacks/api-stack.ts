import * as path from 'path';
import * as cdk from '@aws-cdk/core'
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { AWSJourneyCertificate } from '../constructs/certificate'
import { ICertificate } from '@aws-cdk/aws-certificatemanager'
import { RecordTarget, ARecord, IHostedZone } from '@aws-cdk/aws-route53'
import { ApiGateway as ApiGatewaTarget} from '@aws-cdk/aws-route53-targets';
import { 
   Effect,
   PolicyStatement,
} from "@aws-cdk/aws-iam";
import { LambdaRestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer, Cors, AwsIntegration } from "@aws-cdk/aws-apigateway";
import { Table } from "@aws-cdk/aws-dynamodb";
import { IUserPool, UserPool } from "@aws-cdk/aws-cognito";
import { Duration } from '@aws-cdk/core';
import { Bucket, IBucket } from '@aws-cdk/aws-s3';


interface APIStackProps extends cdk.StackProps {
   userpool: IUserPool,
   filesBucket: IBucket
}
export class ApiStack extends cdk.Stack {
   constructor(scope: cdk.Construct, id: string, props: APIStackProps) {
      super(scope, id, props);

      const { userpool } = props

      const prefix = "api"
      const domain = 'aws-journey.net'
      const apiDomain = `${prefix}.${domain}`
      const apiCertificate = new AWSJourneyCertificate(this, "api-certificate", {prefix})

      const dynamoStatement = this.createDynamoDBStatement()
      const s3Statement = this.createS3Statement(props.filesBucket)

      const apiProcessor = this.createApiProcessor([dynamoStatement, s3Statement])


      const testerProcessor = this.createTesterProcessor(dynamoStatement)

      const api = this.createApi(apiProcessor, apiDomain, apiCertificate.certificate)

      this.addRoute53Record(apiCertificate.hostedZone, apiDomain, api)
      
      const cognitoAuthorizer = this.createCognitoAuthorizer(cdk.Token.asString(userpool.userPoolArn), api)
      const lambdaIntegration = new LambdaIntegration(apiProcessor)
      const testerIntegration = new LambdaIntegration(testerProcessor)
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
      const tester = api.root.addResource('tester')
      tester.addMethod(
         "POST",
         testerIntegration,
         cognitoAuthorizer
      )
   }

   createApi(defaultLambda: Function, apiDomain: string, certificate: ICertificate) {
      const api = new LambdaRestApi(this, 'apollo-api', {
         handler: defaultLambda,
         proxy: false,
         defaultCorsPreflightOptions: {
           allowOrigins: Cors.ALL_ORIGINS,
           allowMethods: Cors.ALL_METHODS
         },
         domainName: {
           domainName: apiDomain,
           certificate,
         }
      });
      return api
   }

   addRoute53Record(hostedZone: IHostedZone, apiDomain: string, api: LambdaRestApi) {
      new ARecord(this, 'ApiDomainNameRecord', {
         zone: hostedZone,
         recordName: apiDomain,
         target: RecordTarget.fromAlias(new ApiGatewaTarget(api))
      });
   }

   createS3Statement(bucket: IBucket) {
      const s3Statement = new PolicyStatement({effect: Effect.ALLOW})
      s3Statement.addActions(
         "s3:GetObject"
      )
      s3Statement.addResources(
         `${bucket.bucketArn}/*`
      )
      return s3Statement
   }

   createDynamoDBStatement() {
      const dynamoStatement = new PolicyStatement({effect: Effect.ALLOW})
      dynamoStatement.addActions(
         "dynamodb:BatchWriteItem",
         "dynamodb:DeleteItem",
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

   createTesterProcessor(policyStatement: PolicyStatement) {
      const processor = new Function(this, 'TesterProcessor', {
         functionName: "api-tester",
         runtime: Runtime.NODEJS_12_X,
         handler: 'test.handler',
         timeout: Duration.minutes(10),
         memorySize: 1028,
         code: Code.fromAsset(path.join(__dirname, '../../testFunction/packaged'))
      });
      processor.addToRolePolicy(policyStatement)
      return processor
   }
   createApiProcessor(policyStatments: PolicyStatement[]) {
      const processor = new Function(this, 'QueryProcessor', {
         functionName: "api-apollo-backend",
         runtime: Runtime.NODEJS_12_X,
         handler: 'graphql.graphqlHandler',
         timeout: Duration.seconds(30),
         code: Code.fromAsset(path.join(__dirname, '../../api/packaged'))
      });
      policyStatments.forEach(statement => {
         processor.addToRolePolicy(statement)
      })
      
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

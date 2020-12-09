import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import {
   Values,
   Assign,
   Schema,
   PrimaryKey,
   GraphqlApi,
   IGraphqlApi,
   KeyCondition,
   AttributeValues,
   MappingTemplate,
   AuthorizationType
} from '@aws-cdk/aws-appsync'
import { Table } from '@aws-cdk/aws-dynamodb'

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props)
      
      const api = this.createAPI()
      
      const DynamoDataSource = this.createDataSource(api)
      
      this.createResolvers(DynamoDataSource)
   }
   
   createDataSource(api: IGraphqlApi) {
      const table = Table.fromTableName(this, 'AWSJourneyTable', 'aws-journey');
      const DynamoDataSource = api.addDynamoDbDataSource('awsJourneyDataSource', table);
      return DynamoDataSource
   }
   
   createAPI() {
      const api = new GraphqlApi(this, 'ContentApi', {
        name: 'aws-journey',
        schema: Schema.fromAsset(path.join(__dirname, '../../api/schema.graphql')),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: AuthorizationType.IAM
          },
        },
        xrayEnabled: true,
      });
      return api
   }
   
   createResolvers(DynamoDataSource: any) {
      const condition = KeyCondition.eq("pk", "pk")
      
      DynamoDataSource.createResolver({
         typeName: 'Query',
         fieldName: 'getLab',
         requestMappingTemplate: MappingTemplate.dynamoDbQuery(condition),
         responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
      });
      
      const PK = new Assign("pk", "pk")
      const SK = new Assign("sk", "sk")
      const overview = new Assign("overview", "overview")
      const tests = new Assign("tests", "tests")
      
      const attributes = new AttributeValues("Attributes", [PK,SK,overview, tests])
      const Key = new PrimaryKey(PK, SK)
      
      DynamoDataSource.createResolver({
         typeName: 'Mutation',
         fieldName: 'addLab',
         requestMappingTemplate: MappingTemplate.dynamoDbPutItem(Key, Values.projecting('Lab')),
         responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
      });
   }
   
}

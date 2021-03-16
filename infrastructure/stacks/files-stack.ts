import * as cdk from '@aws-cdk/core'
import { Bucket, IBucket } from "@aws-cdk/aws-s3";
import { IRole } from '@aws-cdk/aws-iam';

export class FilesStack extends cdk.Stack {
   filesBucket: IBucket
   s3ExecuteApiRole: IRole

   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      this.filesBucket = new Bucket(this, 'FilesBucket', {
         bucketName: 'aws-journey-files'
      })
   }
}

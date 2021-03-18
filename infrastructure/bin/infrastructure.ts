#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { UsersStack } from '../stacks/users-stack'
import { DBStack } from '../stacks/db-stack'
import { ApiStack } from "../stacks/api-stack"
import { FilesStack } from "../stacks/files-stack"

const aws_env = { 
   account: process.env.CDK_DEFAULT_ACCOUNT, 
   region: process.env.CDK_DEFAULT_REGION 
}

const app = new cdk.App();

const filesStack = new FilesStack(app, 'files-stack', {
   env: aws_env
})

const usersStack = new UsersStack(app, 'users-stack',{ 
   env: aws_env
});

new DBStack(app, 'db-stack', {
   env: aws_env
})

new ApiStack(app, 'api-stack', {
   env: aws_env,
   userpool: usersStack.userPool,
   filesBucket: filesStack.filesBucket
})

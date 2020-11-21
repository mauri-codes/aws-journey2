#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { UsersStack } from '../stacks/users-stack';

const app = new cdk.App();
new UsersStack(app, 'UsersStack',{ 
   env: { 
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION 
   }
});

import * as cdk from '@aws-cdk/core';
import { AWSJourneyCertificate } from '../constructs/certificate'
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { RecordTarget, ARecord, IHostedZone } from '@aws-cdk/aws-route53';
import { UserPoolDomainTarget } from '@aws-cdk/aws-route53-targets'
import {
   UserPool,
   IUserPool,
   OAuthScope,
   UserPoolDomain,
   StringAttribute,
   AccountRecovery,
   VerificationEmailStyle,
} from '@aws-cdk/aws-cognito'

export class UsersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const prefix = "auth"
      const domain = 'aws-journey.net'
      const authDomain = `${prefix}.${domain}`
      
      const certificate = new AWSJourneyCertificate(this, "users-certificate", {prefix})
      const hostedZone = certificate.hostedZone
      
      const userPool = this.createUserPool('aws-journey')
      
      const client = this.setUpClient(userPool, domain)
      
      this.setUpCertificate(userPool, authDomain, certificate.certificateArn, hostedZone)
      
   }
   createUserPool(name: string) {
      const userPool = new UserPool(this, 'aws-journey-users', {
         userPoolName: name,
         selfSignUpEnabled: true,
         userVerification: {
            emailSubject: 'Verify your email for aws-journey!',
            emailBody: 'Hello {username}, Thanks for signing up to aws-journey! Use this link to verify your account {##Verify Email##}',
            emailStyle: VerificationEmailStyle.LINK
         },
         signInAliases: {
            username: true,
            email: true
         },
         customAttributes: {
            'role': new StringAttribute({mutable: true})
         },
         passwordPolicy: {
            minLength: 6,
            requireLowercase: false,
            requireUppercase: false,
            requireDigits: false,
            requireSymbols: false
         },
         accountRecovery: AccountRecovery.EMAIL_ONLY,
      });
      return userPool
   }
   
   setUpClient(userPool:IUserPool, domain:string) {
      let client = userPool.addClient('aws-journey-client', {
         oAuth: {
            flows: {
               authorizationCodeGrant: true,
            },
            scopes: [ OAuthScope.OPENID ],
            callbackUrls: [ `https://${domain}/login` ],
            logoutUrls: [  `https://${domain}/logout` ],
         },
         preventUserExistenceErrors: true
      });
      return client
   }
   
   setUpCertificate(
      userPool:IUserPool,
      authDomain:string,
      certificateArn:string,
      hostedZone:IHostedZone
   ) {
      const domainCert = Certificate.fromCertificateArn(this, 'domainCert', certificateArn);
      
      const userPoolDomain = userPool.addDomain("aws-journey-user-domain", {
         customDomain: {
            domainName: authDomain,
            certificate: domainCert,
        }
      })
      new ARecord(this, 'UserPoolCloudFrontAliasRecord', {
         zone: hostedZone,
         recordName: authDomain,
         target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
      });
   }
}

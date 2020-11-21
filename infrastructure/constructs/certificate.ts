import * as cdk from '@aws-cdk/core';
import { Certificate, CertificateValidation } from '@aws-cdk/aws-certificatemanager';
import { HostedZone, IHostedZone } from '@aws-cdk/aws-route53';

class AWSJourneyCertificate extends cdk.Construct {
   domain = 'aws-journey.net'
   certificateArn: string = ""
   hostedZone: IHostedZone
   constructor(scope: cdk.Construct, id: string, {prefix}: {prefix: string}) {
      super(scope, id);
      this.hostedZone = HostedZone.fromLookup(scope,
         "aws-journey-hosted-zone",
         {
            domainName: this.domain
         }
      )
      const certificate = new Certificate(this, 'Certificate', {
         domainName: `${prefix}.${this.domain}`,
         validation: CertificateValidation.fromDns(this.hostedZone),
      });
      this.certificateArn = certificate.certificateArn
   }
}

export { AWSJourneyCertificate }

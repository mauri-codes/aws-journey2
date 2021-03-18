import {  SigneUrlResponse } from "../generated/graphql"
import { Catch } from "../decorators"
import { S3 } from "aws-sdk"
import { DataSource } from 'apollo-datasource'

var s3 = new S3({region: "us-east-1"})

class S3Source extends DataSource {
   bucket:string = 'aws-journey-files'
   @Catch
   async getS3SignedUrl(path: string): Promise<SigneUrlResponse> {      
      let params = {Bucket: this.bucket, Key: path}
      let signedUrl: string = await new Promise((resolve, reject) => {
         s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) reject(err)
            else resolve(url)
         })
      })
      
      return {
         success: true,
         signedUrl
      }
   }
}

export { S3Source }

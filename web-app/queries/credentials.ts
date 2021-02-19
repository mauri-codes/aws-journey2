import { gql } from '@apollo/client'

const getCredentialsList = () => {
   return gql`
      query getAWSCredentials {
         getAWSCredentials {
            success
            credentialsGroup {
               accessKeyId
               secret
               name
            }
         }
      }
   `
}

export { getCredentialsList }

import { gql } from '@apollo/client'
import { AWSCredential } from "../types"

const getCredentialsList = () => {
   return gql`
      query getAWSCredentials {
         getAWSCredentials {
            success
            credentialsGroup {
               accessKeyId
               secret
               name
               mainRegion
               secondaryRegion
            }
         }
      }
   `
}

const setAWSCredentials = (credentials: AWSCredential) => {
   return gql`
      mutation setAWSCredentials {
         setAWSCredentials(credentials: {
            name: "${credentials.name}",
            accessKeyId: "${credentials.accessKeyId}",
            secret: "${credentials.secret}",
            mainRegion: "${credentials.mainRegion}",
            secondaryRegion: "${credentials.secondaryRegion}",
         }) {
            success
            message
         }
      }
   `
}

const deleteAWSCredentials = (name: string) => {
   return gql`
      mutation deleteAWSCredentials {
         deleteAWSCredentials(credentials: {name: "${name}"}) {
            success
            message
         }
      }
   `
}

export { getCredentialsList, setAWSCredentials, deleteAWSCredentials }

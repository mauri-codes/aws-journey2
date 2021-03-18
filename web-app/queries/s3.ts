import { gql } from '@apollo/client'

const getS3SignedUrl = (path) => {
   return gql`
      query getS3SignedUrl {
        getS3SignedUrl(path: "${path}") {
            signedUrl
            success
         }
      }
   `
}

export { getS3SignedUrl }
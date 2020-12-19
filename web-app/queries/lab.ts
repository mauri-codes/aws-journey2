import { gql } from '@apollo/client'

const getLabQuery = (labId) => {
   return gql`
      query GetRates {
         getLab(id: "${labId}") {
               message
               success
               lab {
                  title
                  overview {
                     description
                     goals
                     services
                  }
                  testSection {
                     testGroups {
                     id
                     title
                     tests {
                           id
                     }
                     }
                  }
               }
         }
      }
   `
}

export { getLabQuery }

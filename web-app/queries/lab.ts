import { gql } from '@apollo/client'

const getLabQuery = (labId) => {
   return gql`
      query GetLab {
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
                     testData {
                        testParams,
                        tag
                     }
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

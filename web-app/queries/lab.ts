import { gql } from '@apollo/client'

const getLabQuery = (labId) => {
   return gql`
      query GetLab {
         getLab(id: "${labId}") {
               message
               success
               lab {
                  title
                  labCompleted
                  overview {
                     description
                     goals
                     services
                     resources {
                        resource
                        text
                        conditions {
                           name
                           value
                        }
                     }
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

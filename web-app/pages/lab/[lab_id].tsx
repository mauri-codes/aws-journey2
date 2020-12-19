import { useRouter } from 'next/router'
import { useEffect, useContext } from "react";

import { gql } from '@apollo/client';
import { StoreContext } from "../../state/RootStore"


export default function  Lab () {
   const { authStore: { apolloClient } } = useContext(StoreContext)
   const router = useRouter()
   const { lab_id } = router.query

   useEffect(() => {
      if (apolloClient){
         apolloClient
            .query({
               query: gql`
                  query GetRates {
                     getLab(id: "${lab_id}") {
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
            })
            .then(result => console.log(result));
      }
   }, [apolloClient])

   return (
      <div>{lab_id}</div>
   )
}

import { useRouter } from 'next/router'
import { useEffect, useContext } from "react";

import { gql } from '@apollo/client';
import { StoreContext } from "../../state/RootStore"


export default function  Lab () {
   const { authStore: { apolloClient } } = useContext(StoreContext)

   useEffect(() => {
      if (apolloClient){
         apolloClient
            .query({
               query: gql`
                  query GetRates {
                     getLab(id: "alab") {
                        title
                     }
                  }
               `
            })
            .then(result => console.log(result));
      }
   }, [apolloClient])
   const router = useRouter()
   const { lab_id } = router.query

   return (
      <div>{lab_id}</div>
   )
}

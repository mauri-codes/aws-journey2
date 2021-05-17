/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useContext, useEffect } from 'react'
import { getCredentialsList } from "../../queries/credentials"
import { StoreContext } from "../../state/RootStore"
import { Button } from '@material-ui/core'
import { AWSCredential } from "../../types"
import { AWSCredentialsForm } from "./AWSCredentialsForm"
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CredentialsTableComponent } from "./AWSCredentialsTable"

export default function AWSCredentialsComponent () {

   const [ addingCredentials, setAddingCredentials ] = useState(false)
   const [ credentialsList, setCredentialsList] = useState<undefined | null | AWSCredential[]>(undefined)
   const { authStore } = useContext(StoreContext)
   

   useEffect(() => {
      getCredentials()
   }, [authStore])

   async function getCredentials() {
      const apolloQuery = await authStore.gqlQuery(getCredentialsList())
      if (apolloQuery != null) {
         setCredentialsList(undefined)
         const response = apolloQuery.data.getAWSCredentials
         if ( response.success ) {
            setCredentialsList(response.credentialsGroup)
         } else {
            setCredentialsList(null)
         }
      }
   }

   function deleteCredentialsRecord(name: string) {
      const newCredentialsList = credentialsList.filter(credentials => credentials.name != name)
      setCredentialsList(newCredentialsList)
   }

   function addCredentialsRecord(credentials: AWSCredential) {
      credentials.accessKeyId = `${credentials.accessKeyId.substring(0,5)}****************`
      const newCredentialsList = [ ...credentialsList, credentials ]
      setCredentialsList(newCredentialsList)
   }

   return (
      <UserAWSCredentials>
         <AddCredentialContainer>
            {!addingCredentials &&
               <AddCredentialsButton>
                  <Button variant="contained" color="primary"
                     onClick={() => setAddingCredentials(true)}>
                     Add Credentials
                  </Button>
               </AddCredentialsButton>
            }
            {addingCredentials &&
               <AWSCredentialsForm
                  addCredentialsRecord={addCredentialsRecord}
                  setAddingCredentials={setAddingCredentials}
               />
            }
         </AddCredentialContainer>
            Active AWS Credentials:
            {credentialsList === null &&
               <CredentialsContainer>
                  We couldn't load the credentials, try again later
               </CredentialsContainer>
            }
            {credentialsList === undefined &&
               <CredentialsContainer>
                  <FontAwesomeIcon size={'2x'} icon={faSpinner} spin />
               </CredentialsContainer>
            }
            {credentialsList != null &&
               <CredentialsContainer>
                  <CredentialsTableComponent
                     credentialsList={credentialsList}
                     deleteCredentialsRecord={deleteCredentialsRecord}
                  />
               </CredentialsContainer>
         }
      </UserAWSCredentials>
   )
}

const AddCredentialsButton = styled.div`
   display: flex;
   flex-direction: row-reverse;
   width: 100%;
`

const CredentialsContainer = styled.div`
   margin: 1.5rem 0;
`

const AddCredentialContainer = styled.div`
   display: flex;
   justify-content: center;
   margin-bottom: 1.5rem;
`

const UserAWSCredentials = styled.div`

`

export { AWSCredentialsComponent }

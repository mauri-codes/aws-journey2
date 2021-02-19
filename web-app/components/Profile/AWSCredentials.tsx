/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useContext, useEffect } from 'react'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getCredentialsList } from "../../queries/credentials"
import { StoreContext } from "../../state/RootStore"

interface AWSCredential {
   name: string
   secret: string
   accessKeyId: string
}

export default function AWSCredentialsComponent () {

   const [ addingCredentials, setAddingCredentials ] = useState(false)
   const [ credentialsList, setCredentialsList] = useState<undefined | null | AWSCredential[]>(undefined)
   const { authStore } = useContext(StoreContext)
   const apolloClient = authStore.apolloClient

   const inputCss = {backgroundColor: "backgroundBrighter"}

   useEffect(() => {
      if (apolloClient){
         getCredentials()
      }
      async function getCredentials() {
         const apolloQuery = await apolloClient.query({
            query: getCredentialsList()
         })
         const response = apolloQuery.data.getAWSCredentials
         if ( response.success ) {
            setCredentialsList(response.credentialsGroup)
         } else {
            setCredentialsList(null)
         }
      }
   }, [apolloClient])

   return (
      <UserAWSCredentials>
         <AddCredentialContainer>
            {!addingCredentials &&
               <AddCredentialsButton
                  sx={{color: "primary"}}
                  onClick={() => setAddingCredentials(true)}
               >
                  Add Credentials <FontAwesomeIcon icon={faPlusCircle} />
               </AddCredentialsButton>
            }
            {addingCredentials &&
               <CredentialsForm>
                  <FormGroup>
                     <Label htmlFor={"cred"}>Name: </Label>
                     <Input id={"cred"} sx={inputCss}></Input>
                  </FormGroup>
                  <FormGroup>
                     <Label htmlFor={"cred_id"}>AWS Access Key Id: </Label>
                     <Input id={"cred_id"} sx={inputCss}></Input>
                  </FormGroup>
                  <FormGroup>
                     <Label htmlFor={"cred_key"}>AWS Secret Access Key: </Label>
                     <Input id={"cred_key"} sx={inputCss}></Input>
                  </FormGroup>
                  <AddCredentialsButton
                     sx={{color: "primary", alignSelf: "flex-end"}}
                     onClick={() => setAddingCredentials(true)}
                  >
                     Add Credentials <FontAwesomeIcon icon={faPlusCircle} />
                  </AddCredentialsButton>
                  <CredentialsMessage>
                     *Credential's Names should only contain upper or lower case letters and numbers.
                  </CredentialsMessage>          
               </CredentialsForm>
            }
         </AddCredentialContainer>
         Active AWS Credentials:
         {credentialsList === null &&
         <div>We couldn't load the credentials, try again later</div>
         }
         {credentialsList != null &&
         <CredentialsTable>
            <ActiveCredential>
               <TableHeader sx={{flex: "2 0 0", fontFamily: "bodyBold"}}>Name</TableHeader>
               <TableHeader sx={{flex: "3 0 0", fontFamily: "bodyBold", borderLeft: "none"}}>Id</TableHeader>
               <TableHeader sx={{flex: "1 0 0", fontFamily: "bodyBold", borderLeft: "none"}}></TableHeader>
            </ActiveCredential>
            <div>{credentialsList.map(credentials => (
               <ActiveCredential
                  key={credentials.name}>
                  <CredentialName>{credentials.name}</CredentialName>
                  <CredentialId>{credentials.accessKeyId}</CredentialId>
                  <CredentialOptions>options</CredentialOptions>
               </ActiveCredential>
            ))}
            </div>
         </CredentialsTable>

         }
      </UserAWSCredentials>
   )
}

const CredentialsMessage = styled.div`
   font-size: 0.7rem;
`

const CredentialsForm = styled.div`
   display: flex;
   flex-direction: column;
   width: 70%;

`

const FormGroup = styled.div`
   display: flex;
   flex: 1 0 0;
   margin: 0.2rem;
   padding: 0.2rem;
`

const Label = styled.label`
   flex: 1 0 0;
`
const Input = styled.input`
   flex: 2 0 0;
   height: 100%;
   outline: none;
   border: 0.5px solid gray;
   &:focus {
      border: 1.5px solid black;
   }
`
const ActionButton = styled.div`
   flex: 2 0 0;
`

const AddCredentialsButton = styled.div`
   margin: 1rem;
   cursor: pointer;
`

const AddCredentialContainer = styled.div`
   display: flex;
   justify-content: center;
   margin-bottom: 1.5rem;
`

const CredentialsTable = styled.div`
   margin-top: 1rem;
`

const ActiveCredential = styled.div`
   display: flex;
`

const TableHeader = styled.div`
   border: 0.5px solid lightgray;
   padding: 0.6rem;

`

const CredentialName = styled.div`
   flex: 2 0 0;
   padding: 0.6rem;
   border-left: 0.5px solid lightgray;
   border-bottom: 0.5px solid lightgray;
`
const CredentialId = styled.div`
   flex: 3 0 0;
   padding: 0.6rem;
   border-left: 0.5px solid lightgray;
   border-bottom: 0.5px solid lightgray;
   border-right: 0.5px solid lightgray;
`
const CredentialOptions = styled.div`
   flex: 1 0 0;
   padding: 0.6rem;
   border-bottom: 0.5px solid lightgray;
   border-right: 0.5px solid lightgray;
`

const UserAWSCredentials = styled.div`

`

export { AWSCredentialsComponent }

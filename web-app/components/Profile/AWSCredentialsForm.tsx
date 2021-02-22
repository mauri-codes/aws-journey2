/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useContext } from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setAWSCredentials } from "../../queries/credentials"
import { StoreContext } from "../../state/RootStore"
import { 
   TextField, Button,
   Chip
} from '@material-ui/core';
import { Done, Cancel } from '@material-ui/icons'
import { AWSCredential } from "../../types"
import { isAlphanumeric, isAwsId, isAwsSecret } from '../../lib/regex'
import { delay } from "../../lib/utils";

const NOT_LOADING = "NOT_LOADING"
const LOADING = "LOADING"
const REQUEST_SUCCESSFUL = "REQUEST_SUCCESSFUL"
const REQUEST_FAILED = "REQUEST_FAILED"

interface Validation {
   valid: boolean
   message?: string
}

interface ValidationInputs {
   name: Validation
   secret: Validation
   accessKeyId: Validation
}

export default function AWSCredentialsForm (
   {
      addCredentialsRecord,
      setAddingCredentials}:
   {
      addCredentialsRecord: (credentials: AWSCredential) => void
      setAddingCredentials: (adding: boolean) => void
   }) {
   const { authStore } = useContext(StoreContext)
   const apolloClient = authStore.apolloClient

   const [ loadingSetCredentials, setLoadingSetCredentials ] = useState(NOT_LOADING)
   const [ validInputs, setValidInputs ] = useState<ValidationInputs>(undefined)
   let emptyAWSCredentials: AWSCredential = {
      name: "", secret: "", accessKeyId: ""
   }
   function allValidInputs() {
      let allValidInputs = true
      if (validInputs!== undefined ) {
         allValidInputs = validInputs.name.valid && validInputs.accessKeyId.valid && validInputs.secret.valid
      }
      const noEmptyInputs = newCredentials.name != "" && newCredentials.accessKeyId != "" && newCredentials.secret != ""
      return allValidInputs && noEmptyInputs
   }
   const [ newCredentials, setNewCredentials ] = useState(emptyAWSCredentials)
   function updateInputValidation(credentials: AWSCredential) {
      let inputSummary = {
         name: {
            valid: isAlphanumeric.test(credentials.name),
            message: "Name should only contain Alphanumeric characters"
         },
         accessKeyId: {
            valid: isAwsId.test(credentials.accessKeyId) || credentials.accessKeyId == "",
            message: "Not a valid AWS Key Id"
         },
         secret: {
            valid: isAwsSecret.test(credentials.secret) || credentials.secret == "",
            message: "Not a valid AWS Secret Access Key"
         }
      }
      setValidInputs(inputSummary)
   }
   function updateNewCredentialsField(data: AWSCredential) {
      const updatedCredentials = {...newCredentials, ...data}
      updateInputValidation(updatedCredentials)
      setNewCredentials(updatedCredentials)
   }
   async function setCredentialsInDB() {
      setLoadingSetCredentials(LOADING)
      const response = await apolloClient.mutate({
         mutation: setAWSCredentials(newCredentials)
      })
      const successfulUpdate = response.data.setAWSCredentials.success

      if (successfulUpdate) {
         setLoadingSetCredentials(REQUEST_SUCCESSFUL)
         await delay(2000);
         addCredentialsRecord(newCredentials)
         cancelAddingCredentials()
      } else {
         setLoadingSetCredentials(REQUEST_FAILED)
         await delay(2000);
      }
      setLoadingSetCredentials(NOT_LOADING)
   }

   function cancelAddingCredentials() {
      setNewCredentials(emptyAWSCredentials)
      setAddingCredentials(false)
   }

   function setCredentials() {
      if(allValidInputs()) {
         setCredentialsInDB()
      }
   }
   return (
      <CredentialsForm>
         <CredentialsField>
            <TextField label="Name" variant="outlined"
               error={validInputs !== undefined && !validInputs.name.valid}
               helperText={(validInputs !== undefined && !validInputs.name.valid)? validInputs.name.message: null}
               value={newCredentials.name}
               onChange={(event) => updateNewCredentialsField({name: event.target.value})}
            />
         </CredentialsField>
         <CredentialsField>
            <TextField label="AWS Access Key Id" variant="outlined"
               error={validInputs !== undefined && !validInputs.accessKeyId.valid}
               helperText={(validInputs !== undefined && !validInputs.accessKeyId.valid)? validInputs.accessKeyId.message: null}
               value={newCredentials.accessKeyId}
               onChange={(event) => updateNewCredentialsField({accessKeyId: event.target.value})}
            />
         </CredentialsField>
         <CredentialsField>
            <TextField label="AWS Secret Access Key" variant="outlined"
               error={validInputs !== undefined && !validInputs.secret.valid}
               helperText={(validInputs !== undefined && !validInputs.secret.valid)? validInputs.secret.message: null}
               value={newCredentials.secret}
               onChange={(event) => updateNewCredentialsField({secret: event.target.value})}
            />
         </CredentialsField>
         {loadingSetCredentials === LOADING &&
            <LoadingCredentialIcon sx={{color: "primary"}}>
               <FontAwesomeIcon size={'2x'} icon={faSpinner} spin />
            </LoadingCredentialIcon>
         }
         {loadingSetCredentials === NOT_LOADING &&
            <AddCredentialsButton>
               <Button variant="contained" color="primary"
                  disabled={!allValidInputs()}
                  onClick={() => setCredentials()}>
                  Add Credentials
               </Button>
               <Button
                  variant="contained"
                  css={{marginRight: "1.5rem !important"}}
                  onClick={() => cancelAddingCredentials()}
               >
                  Cancel</Button>
            </AddCredentialsButton>
         }
         {loadingSetCredentials === REQUEST_SUCCESSFUL &&
            <Chip
               label="Credentials Successfully Stored"
               css={{
                  color: "green",
               }}
               icon={<Done css={{color: "green"}} />}
               variant="outlined"
          />
         }
         {loadingSetCredentials === REQUEST_FAILED &&
            <Chip
               label="Failed to Store Credentials"
               css={{
                  color: "red",
               }}
               icon={<Cancel css={{color: "red"}} />}
               variant="outlined"
          />
         }
      </CredentialsForm>
   )
}

const LoadingCredentialIcon = styled.div`
   align-self: center;
`
const AddCredentialsButton = styled.div`
   display: flex;
   flex-direction: row-reverse;
   width: 100%;
`

const CredentialsField = styled.div`
   > * {
      width: 100%;
   }
   flex: 5rem 0 0;
`

const CredentialsForm = styled.div`
   display: flex;
   flex-direction: column;
   width: 70%;
   margin: 1rem 0;

`

export { AWSCredentialsForm }


/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useContext, useEffect } from 'react'
import { faPlusCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getCredentialsList, setAWSCredentials } from "../../queries/credentials"
import { StoreContext } from "../../state/RootStore"
import { 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   TextField, Button,
   Paper,
   Chip
} from '@material-ui/core';
import { Done, Cancel } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'
import { AWSCredential } from "../../types";



interface Validation {
   valid: boolean
   message?: string
}

interface ValidationInputs {
   name: Validation
   secret: Validation
   accessKeyId: Validation
}

const useStyles = makeStyles({
   table: {
     width: "100%",
     minWidth: "500px"
   }
});

const NOT_LOADING = "NOT_LOADING"
const LOADING = "LOADING"
const REQUEST_SUCCESSFUL = "REQUEST_SUCCESSFUL"
const REQUEST_FAILED = "REQUEST_FAILED"

export default function AWSCredentialsComponent () {

   const [ addingCredentials, setAddingCredentials ] = useState(false)
   const [ credentialsList, setCredentialsList] = useState<undefined | null | AWSCredential[]>(undefined)
   const { authStore } = useContext(StoreContext)
   const apolloClient = authStore.apolloClient
   let emptyAWSCredentials: AWSCredential = {
      name: "", secret: "", accessKeyId: ""
   }
   const [ newCredentials, setNewCredentials ] = useState(emptyAWSCredentials)

   const [ loadingSetCredentials, setLoadingSetCredentials ] = useState(NOT_LOADING)
   const [ validInputs, setValidInputs ] = useState<ValidationInputs>(undefined)

   const classes = useStyles();


   const isAlphanumeric = /^[A-Za-z0-9]*$/g
   const isAwsId = /(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])/g
   const isAwsSecret = /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g

   const delay = ms => new Promise(res => setTimeout(res, ms));

   useEffect(() => {
      if (apolloClient){
         getCredentials()
      }
   }, [apolloClient])

   function updateInputValidation(credentials: AWSCredential) {
      setValidInputs({
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
      })
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

   function updateNewCredentialsField(data: AWSCredential) {
      const updatedCredentials = {...newCredentials, ...data}
      updateInputValidation(updatedCredentials)
      setNewCredentials(updatedCredentials)
   }

   function allValidInputs() {
      let allValidInputs = true
      if (validInputs!== undefined ) {
         allValidInputs = validInputs.name.valid && validInputs.accessKeyId.valid && validInputs.secret.valid
      }
      const noEmptyInputs = newCredentials.name != "" && newCredentials.accessKeyId != "" && newCredentials.secret != ""
      
      return allValidInputs && noEmptyInputs
   }

   function addCredentialsRecord(credentials: AWSCredential) {
      credentials.accessKeyId = `${credentials.accessKeyId.substring(0,5)}****************`
      const newCredentialsList = [ ...credentialsList, credentials ]
      setCredentialsList(newCredentialsList)
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
                           css={{marginRight: "1.5rem"}}
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
            }
         </AddCredentialContainer>
            Active AWS Credentials:
            {credentialsList === null &&
            <CredentialsContainer>We couldn't load the credentials, try again later</CredentialsContainer>
            }
            {credentialsList != null &&
               <CredentialsContainer>
                  <TableContainer component={Paper}>
                     <Table className={classes.table} sx={{backgroundColor: "background"}} aria-label="simple table">
                        <TableHead sx={{backgroundColor: "background"}}>
                           <TableRow>
                              <TableCell sx={{fontFamily: "bodyBold"}}>Name</TableCell>
                              <TableCell sx={{fontFamily: "bodyBold"}}>Id</TableCell>
                              <TableCell sx={{fontFamily: "bodyBold"}}>Options</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {credentialsList.map((row) => (
                              <TableRow key={row.name}>
                                 <TableCell sx={{fontFamily: "body"}}>{row.name}</TableCell>
                                 <TableCell sx={{fontFamily: "body"}}>{row.accessKeyId}</TableCell>
                                 <TableCell sx={{fontFamily: "body"}}>{"Options"}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>

                     </Table>
                  </TableContainer>
               </CredentialsContainer>
         }
      </UserAWSCredentials>
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

const CredentialsContainer = styled.div`
   margin: 1.5rem 0;
`

const CredentialsMessage = styled.div`
   margin-bottom: 1rem;
   font-size: 0.7rem;
`

const CredentialsForm = styled.div`
   display: flex;
   flex-direction: column;
   width: 70%;
   margin: 1rem 0;

`
const AddCredentialContainer = styled.div`
   display: flex;
   justify-content: center;
   margin-bottom: 1.5rem;
`

const UserAWSCredentials = styled.div`

`

export { AWSCredentialsComponent }

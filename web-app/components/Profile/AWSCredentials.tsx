/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useContext, useEffect } from 'react'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getCredentialsList } from "../../queries/credentials"
import { StoreContext } from "../../state/RootStore"
import { 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   TextField, Button,
   Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface AWSCredential {
   name?: string
   secret?: string
   accessKeyId?: string
}

const useStyles = makeStyles({
   table: {
     width: "100%",
     minWidth: "500px"
   }
 });

export default function AWSCredentialsComponent () {

   const [ addingCredentials, setAddingCredentials ] = useState(false)
   const [ credentialsList, setCredentialsList] = useState<undefined | null | AWSCredential[]>(undefined)
   const { authStore } = useContext(StoreContext)
   const apolloClient = authStore.apolloClient
   let emptyAWSCredentials: AWSCredential = {
      name: "", secret: "", accessKeyId: ""
   }
   const [ newCredentials, setNewCredentials ] = useState(emptyAWSCredentials)

   const inputCss = {backgroundColor: "backgroundBrighter"}
   const classes = useStyles();

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

   function updateNewCredentials(data: AWSCredential) {
      const updatedCredentiasl = {...newCredentials, ...data}
      setNewCredentials(updatedCredentiasl)
   }

   return (
      <UserAWSCredentials>
         <AddCredentialContainer>
            {!addingCredentials &&
               <AddCredentialsButton2>
                  <Button variant="contained" color="primary"
                     onClick={() => setAddingCredentials(true)}>
                     Add Credentials
                  </Button>
               </AddCredentialsButton2>
            }
            {addingCredentials &&
               <CredentialsForm>
               <CredentialsMessage>
                  *Credential's Names should only contain upper or lower case letters and numbers.
               </CredentialsMessage>
                  <CredentialsField>
                     <TextField id="outlined-basic" label="Name" variant="outlined"
                        value={newCredentials.name}
                        onChange={(event) => updateNewCredentials({name: event.target.value})}
                     />
                  </CredentialsField>
                  <CredentialsField>
                     <TextField id="outlined-basic" label="AWS Access Key Id" variant="outlined"
                        value={newCredentials.accessKeyId}
                        onChange={(event) => updateNewCredentials({accessKeyId: event.target.value})}
                     />
                  </CredentialsField>
                  <CredentialsField>
                     <TextField id="outlined-basic" label="AWS Secret Access Key" variant="outlined"
                        value={newCredentials.secret}
                        onChange={(event) => updateNewCredentials({secret: event.target.value})}
                     />
                  </CredentialsField>
                  <AddCredentialsButton
                     sx={{color: "primary", alignSelf: "flex-end"}}
                     onClick={() => setAddingCredentials(true)}
                  >
                     Add Credentials <FontAwesomeIcon icon={faPlusCircle} />
                  </AddCredentialsButton>
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
const AddCredentialsButton2 = styled.div`
   display: flex;
   flex-direction: row-reverse;
   align-self: flex-end;
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

const AddCredentialsButton = styled.div`
   margin: 1rem;
   cursor: pointer;
`

const AddCredentialContainer = styled.div`
   display: flex;
   justify-content: center;
   margin-bottom: 1.5rem;
`

const UserAWSCredentials = styled.div`

`

export { AWSCredentialsComponent }

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useContext, useState } from 'react'
import { 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Paper, Chip, Icon
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles'
import { AWSCredential } from "../../types"
import { StoreContext } from "../../state/RootStore"
import { IconButton } from '@material-ui/core';
import { deleteAWSCredentials } from "../../queries/credentials";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles({
   table: {
     width: "100%",
     minWidth: "500px"
   }
});

const NONE = "-1"

export default function CredentialsTableComponent (
   {
      credentialsList,
      deleteCredentialsRecord
   }:
   {
      credentialsList: undefined | null | AWSCredential[]
      deleteCredentialsRecord: (name: string) => void
   }
) {
   const { authStore } = useContext(StoreContext)
   const apolloClient = authStore.apolloClient
   const classes = useStyles();
   const [ loadingDeletion, setLoadingDeletion ] = useState<string>(NONE)
   async function deleteCredentials(name: string) {
      setLoadingDeletion(name)
      const apolloMutation = await apolloClient.mutate({
         mutation: deleteAWSCredentials(name)
      })
      const successfulRequest = apolloMutation.data.deleteAWSCredentials.success
      setLoadingDeletion(NONE)
      if (successfulRequest) {
         deleteCredentialsRecord(name)
      }

   }
   return (
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
            {credentialsList.map((credentials) => (
               <TableRow key={credentials.name}>
                  <TableCell sx={{fontFamily: "body"}}>{credentials.name}</TableCell>
                  <TableCell sx={{fontFamily: "body"}}>{credentials.accessKeyId}</TableCell>
                  <TableCell sx={{fontFamily: "body"}}>
                     <IconButton
                        onClick={() => deleteCredentials(credentials.name)}
                        disabled = {loadingDeletion !== NONE}
                     >
                        {loadingDeletion === NONE &&
                           <Delete
                              color={"error"}
                           />
                        }
                        {loadingDeletion !== NONE &&
                           <div>
                              {credentials.name === loadingDeletion &&
                                 <FontAwesomeIcon icon={faSpinner} spin />
                              }
                              {credentials.name !== loadingDeletion &&
                                 <Delete
                                    color={"disabled"}
                                 />
                              }
                           </div>
                        }
                     </IconButton>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>

      </Table>
   </TableContainer>
   )
}

export { CredentialsTableComponent }

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useContext, useState } from 'react'
import { 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Paper, Chip, Icon
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { AWSCredential } from "../../types"
import { StoreContext } from "../../state/RootStore"
import { IconButton } from '@material-ui/core';
import { deleteAWSCredentials } from "../../queries/credentials";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HeaderWithStyles = withStyles(theme => ({
   root: {
      backgroundColor: theme.palette.secondary.light
   }
}))(TableHead)

const TableWithStyles = withStyles(theme => ({
   root: {
      width: "100%",
      minWidth: "500px",
      border: "2px solid " + theme.palette.secondary.light
   }
}))(Table)

const StyledTableRow = withStyles((theme) => ({
   root: {
     '&:nth-of-type(odd)': {
       backgroundColor: "hsl(0, 0%, 90%)",
     },
   },
 }))(TableRow);


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
      <TableWithStyles sx={{backgroundColor: "background"}} aria-label="simple table">
         <HeaderWithStyles>
            <TableRow>
               <TableCell sx={{fontFamily: "bodyBold"}}>Name</TableCell>
               <TableCell sx={{fontFamily: "bodyBold"}}>Id</TableCell>
               <TableCell sx={{fontFamily: "bodyBold"}}>Options</TableCell>
            </TableRow>
         </HeaderWithStyles>
         <TableBody>
            {credentialsList.map((credentials) => (
               <StyledTableRow key={credentials.name}>
                  <TableCell sx={{fontFamily: "body"}}>{credentials.name}</TableCell>
                  <TableCell sx={{fontFamily: "body"}}>{credentials.accessKeyId}</TableCell>
                  <TableCell sx={{fontFamily: "body"}}>
                     <IconButton
                        onClick={() => deleteCredentials(credentials.name)}
                        disabled = {loadingDeletion !== NONE}
                     >
                        {loadingDeletion === NONE &&
                           <Delete css={{color: "black"}} />
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
               </StyledTableRow>
            ))}
         </TableBody>

      </TableWithStyles>
   </TableContainer>
   )
}

export { CredentialsTableComponent }

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { AWSCredential } from "../../types"

const useStyles = makeStyles({
   table: {
     width: "100%",
     minWidth: "500px"
   }
});

export default function CredentialsTableComponent (
   {credentialsList}:
   {credentialsList: undefined | null | AWSCredential[]}
) {
   const classes = useStyles();
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
   )
}

export { CredentialsTableComponent }

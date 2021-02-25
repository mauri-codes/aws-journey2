/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useEffect, useContext } from 'react'
import { AWSCredential, TestSection } from "../../types"
import { LabContent, SubTitle, ContentHeader } from "./styled"
import { Button, FormHelperText, InputLabel, makeStyles } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { getCredentialsList } from "../../queries/credentials";
import { StoreContext } from "../../state/RootStore";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const useStyles = makeStyles((theme) => ({
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
   root: {
     '& > *': {
       margin: theme.spacing(1),
     },
   },
 }));
const useStylesForm = makeStyles((theme) => ({
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
   selectEmpty: {
      marginTop: theme.spacing(2),
   },
}));

function TestsComponent ({testSection}: {testSection: TestSection}) {
   const [credentials, setCredentials] = useState(undefined)
   const [ credentialsList, setCredentialsList] = useState<undefined | null | AWSCredential[]>(undefined)
   const { authStore } = useContext(StoreContext)
   const apolloClient = authStore.apolloClient

   useEffect(() => {
      if (apolloClient){
         getCredentials()
      }
   }, [apolloClient])

   async function getCredentials() {
      const apolloQuery = await apolloClient.query({
         query: getCredentialsList()
      })
      setCredentialsList(undefined)
      const response = apolloQuery.data.getAWSCredentials
      if ( response.success ) {
         setCredentialsList(response.credentialsGroup)
         setCredentials({name: response.credentialsGroup[0].name})
      } else {
         setCredentialsList(null)
      }
   }
   const classes = useStyles();
   return (
      <LabContent>
         <SubTitle sx={{fontFamily: "subTitle"}}>Tests</SubTitle>
         <TestActions>
            {
               credentialsList === undefined &&
                  <FontAwesomeIcon size={'2x'} icon={faSpinner} spin />
            }
            {
               credentialsList !== undefined &&
               <FormControl className={classes.formControl}>
                  <Select
                     native
                     value={ credentials != null ? credentials.name: "None"}
                     onChange={(event) => setCredentials(event.target.name)}
                     inputProps={{
                        name: 'name'
                     }}
                  >
                     {
                        credentialsList == null &&
                           <option value={"None"}>None</option>
                     }
                     {
                        credentialsList != null &&
                        
                        credentialsList.map(credential => (
                           <option
                              value={credential.name}
                              key={credential.name}
                           >
                              {credential.name}
                           </option>
                        ))                        
                     }
                  </Select>
                  <FormHelperText>AWS Credentials</FormHelperText>
               </FormControl>
            }
            <div className={classes.root}>
               <Button variant="contained" color="primary">
                  Test
               </Button>
            </div>

         </TestActions>

         {testSection.testGroups.map(testGroup => <div key={testGroup.id}>
            <ContentHeader>{testGroup.title}</ContentHeader>
            <hr style={{marginBottom: "0.3rem"}} />
            {testGroup.tests.map((test, index) => <Test key={test.id}>
               <TestCount>{index + 1}</TestCount>
               <TestDescription>{test.id}</TestDescription>
               <TestResult>result</TestResult>
            </Test>)}
         </div>)}
      </LabContent>
   )
}

const TestActions = styled.div`
   display: flex;
   justify-content: center;
`

const Test = styled.div`
   display: flex;
   font-size: 1rem;
`
const TestCount = styled.div`
   flex: 0 0 1rem;
   font-weight: bold;
   padding-top: 0.3rem;
   padding-bottom: 0.3rem;
`
const TestDescription = styled.div`
   flex: 1 0 0;
   min-width: 0;
  /* white-space: nowrap;
  text-overflow: ellipsis */
   padding-top: 0.3rem;
   padding-bottom: 0.3rem;
   overflow: hidden;
`
const TestResult = styled.div`
   flex: 1 0 0;
   min-width: 0;
   padding-left: 1rem;
   padding-top: 0.3rem;
   padding-bottom: 0.3rem;
`

export { TestsComponent }


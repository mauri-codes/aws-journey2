/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AWSCredential, TestSection } from "../../types"
import { LabContent, SubTitle, ContentHeader } from "./styled"
import { Button, FormHelperText, InputLabel, makeStyles, TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { getCredentialsList } from "../../queries/credentials";
import { StoreContext } from "../../state/RootStore";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'


const useStyles = makeStyles((theme) => ({
   formControl: {
      margin: theme.spacing(1),
      minWidth: "300px",
      width: "100%"
   },
   inputText: {
      marginTop: "1rem",
      width: "100%"
   },
   testButton: {
      width: "100%"
   },
   root: {
     '& > *': {
       margin: theme.spacing(1),
     },
   },
 }));

function TestsComponent ({testSection}: {testSection: TestSection}) {
   const [credentials, setCredentials] = useState(undefined)
   const [ credentialsList, setCredentialsList] = useState<undefined | null | AWSCredential[]>(undefined)
   const { authStore } = useContext(StoreContext)
   const [ testParamGroup, setTestParamGroup ] = useState(undefined)
   const apolloClient = authStore.apolloClient
   let { testData: {tag, testParams}} = testSection
   const router = useRouter()
   const { lab_id } = router.query

   useEffect(() => {
      let paramsObject = testParams.reduce((acc, param) => ({[param]: "", ...acc}), {})
      setTestParamGroup(paramsObject)
   }, [testSection])

   useEffect(() => {
      if (apolloClient){
         getCredentials()
      }
   }, [apolloClient])

   async function test() {
      let params = {
         lab: lab_id,
         testParams: testParamGroup,
         credentialsLabel: credentials.name
      }
      return await authStore.post("/tester", params)
   }

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
   function updateField(param: string, input: string) {
      let newParams = {...testParamGroup, [param]: input}
      setTestParamGroup(newParams)
   }
   const classes = useStyles();
   return (
      <LabContent>
         <SubTitle sx={{fontFamily: "subTitle"}}>Tests</SubTitle>
         <div sx={{fontFamily:"body"}}>
            Once you finish the lab, run some tests! Just make sure your credentials are correctly set up in the platform.
         </div>
         <TestActions>
            {
               (credentialsList === undefined || testSection == null) &&
                  <FontAwesomeIcon size={'2x'} icon={faSpinner} spin />
            }
            {
               credentialsList !== undefined && testSection != null &&
               <FormControl className={classes.formControl}>
                  <Select
                     native
                     value={ credentials != null ? credentials.name: "None"}
                     onChange={(event) => setCredentials({name: event.target.value})}
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
                  {
                     Object.keys(testParamGroup).map(param => (
                        <div key={param}>
                           <TextField
                              className={classes.inputText}
                              value={testParamGroup[param]}
                              onChange={(event) => updateField(param, event.target.value)}
                           />
                           <FormHelperText>{param}</FormHelperText>
                        </div>
                     ))
                  }
               </FormControl>
            }
            <div className={classes.root}>
               <Button
                  className={classes.testButton}
                  variant="contained"
                  color="primary"
                  onClick={() => test()}
               >
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
   flex-direction: column;
   align-self: center;
   margin: 2rem 0;
   width: 50%;
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


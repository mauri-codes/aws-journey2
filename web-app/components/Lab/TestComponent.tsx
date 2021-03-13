/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import { TestResultsComponent } from "./TestResultsComponent";
import React, { useState, useEffect, useContext } from 'react'
import { AWSCredential, TestSection, TestGroup } from "../../types"
import { LabContent, SubTitle } from "./styled"
import { Button, FormHelperText, makeStyles, TextField } from '@material-ui/core';
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
   const [ allTestsSuccessful, setAllTestsSuccessful ] = useState()

   const [ testGroups, setTestGroups ] = useState([...testSection.testGroups])
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

   function updateTestGroupsResults(testResults) {
      let testGroupObject = {}
      testResults.forEach(({id, success, tests}) => {
         let testObject = {}
         tests.forEach(({id, success, error}) => {
            testObject[id] = {
               success,
               error
            }
         })
         testGroupObject[id] = {success, tests: testObject}
      })
      
      let finalTests = testGroups.map(testGroup => {
         let newTestGroup:TestGroup = {...testGroup}
         let testGroupId = newTestGroup.id
         newTestGroup.success = testGroupObject[testGroupId].success
         let newTests = testGroup.tests.map(test => {
            let newTest = {...test}
            testGroupObject[testGroupId].tests
            let { error, success } = testGroupObject[testGroupId].tests[test.id]
            newTest.error = error
            newTest.success = success
            return newTest
         })
         newTestGroup.tests = newTests
         return newTestGroup
      })
      
      setTestGroups(finalTests)
   }

   async function test() {
      let credentialsInfo = getCredentialsInfo(credentials.name)      
      testParamGroup.region = credentialsInfo.mainRegion
      testParamGroup.secondaryRegion = credentialsInfo.secondaryRegion
      let params = {
         lab: lab_id,
         testParams: testParamGroup,
         credentialsLabel: credentials.name
      }
      let testResult = await authStore.post("/tester", params)
      updateTestGroupsResults(testResult.data.tests.testGroups)
      setAllTestsSuccessful(testResult.data.tests.success) 

   }

   function getCredentialsInfo(credentialsName: string) {
      return credentialsList.find(credentials => credentials.name == credentialsName)
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
   function allValidInputs() {
      const paramsGroup = (testParamGroup == null)? {}: testParamGroup
      const allParams = Object.keys(paramsGroup)
         .filter(param => param != "region" && param != "secondaryRegion")
         .map(param => paramsGroup[param] != "")
      const allParamsFilled = allParams.every(param => param)
      return allParamsFilled || allParams.length == 0
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
                     Object.keys(testParamGroup)
                        .filter(param => param != "region" && param != "secondaryRegion")
                        .map(param => (
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
                  disabled={!allValidInputs()}
               >
                  Test
               </Button>
            </div>
         </TestActions>
         <TestResultsComponent testGroups={testGroups} />
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

export { TestsComponent }

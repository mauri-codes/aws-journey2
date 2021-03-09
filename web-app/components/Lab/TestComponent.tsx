/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AWSCredential, TestSection, TestGroup } from "../../types"
import { LabContent, SubTitle, ContentHeader } from "./styled"
import { Button, FormHelperText, InputLabel, makeStyles, TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { getCredentialsList } from "../../queries/credentials";
import { StoreContext } from "../../state/RootStore";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AssessmentOutlined, FiberManualRecord as Circle } from '@material-ui/icons';
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
   const [ testGroups, setTestGroups ] = useState( {...testSection.testGroups})
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
         tests.forEach(({id, success}) => {
            testObject[id] = success
         })
         testGroupObject[id] = {success, tests: testObject}
      })
      let xtestGroups = testGroups
      if (!Array.isArray(testGroups)) {
         let arr = []
         let parsed = JSON.parse(JSON.stringify(testGroups))
         for(let x in parsed){
            arr.push(parsed[x]);
         }
         xtestGroups = arr
      }
      
      let finalTests = xtestGroups.map(testGroup => {
         let newTestGroup:TestGroup = {...testGroup}
         let testGroupId = newTestGroup.id
         newTestGroup.success = testGroupObject[testGroupId].success
         let newTests = testGroup.tests.map(test => {
            test.success = testGroupObject[testGroupId].tests[test.id]
            return test
         })
         newTestGroup.tests = newTests
         return newTestGroup
      })
      setTestGroups(finalTests)
   }

   async function test() {
      let params = {
         lab: lab_id,
         testParams: testParamGroup,
         credentialsLabel: credentials.name
      }
      let testResult = await authStore.post("/tester", params)
      updateTestGroupsResults(testResult.data.tests.testGroups)
      setAllTestsSuccessful(testResult.data.tests.success) 

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

         {testSection.testGroups.map(testGroup => <TestCollection key={testGroup.id}>
            <TestHeader>
               <AssessmentOutlined />
               <TestsTitle sx={{fontFamily: "subTitle"}}>{testGroup.title}</TestsTitle>
            </TestHeader> 
            <hr style={{marginBottom: "0.6rem"}} />
            {testGroup.tests.map((test, index) => <TestBlock sx={{fontFamily:"body"}} key={test.id}>
               <Test>
                  <Circle style={{fontSize: 15}}/>
                  <TestDescription>{test.id}</TestDescription>
               </Test>
               <TestResult>result</TestResult>
            </TestBlock>)}
         </TestCollection>)}
      </LabContent>
   )
}

const TestHeader = styled.div`
   display: flex;
   align-items: center;
   margin: 1.4rem 0 0.5rem 0;
   padding-left: 0.7rem;
`

const TestBlock = styled.div`
   background-color: lightgreen;
   margin: 0 0.7rem;
   padding: 0.6rem;
`

const TestActions = styled.div`
   display: flex;
   flex-direction: column;
   align-self: center;
   margin: 2rem 0;
   width: 50%;
`

const TestsTitle = styled.div`
   font-weight: bold;
   margin-left: 0.5rem;
`

const TestCollection = styled.div`
   background-color: lightgray;
   padding: 0 0.7rem;
`

const Test = styled.div`
   display: flex;
   align-items: center;
   font-size: 0.9rem;
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
   margin-left: 0.5rem;
`
const TestResult = styled.div`
   flex: 1 0 0;
   min-width: 0;
   font-size: 0.85rem;
   margin-left: 1.4rem;
`

export { TestsComponent }


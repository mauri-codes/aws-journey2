/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useEffect, useContext } from 'react'
import { AWSCredential, TestSection, TestGroup, Test } from "../../types"
import { LabContent, SubTitle, ContentHeader } from "./styled"
import { Button, FormHelperText, InputLabel, makeStyles, TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { getCredentialsList } from "../../queries/credentials";
import { StoreContext } from "../../state/RootStore";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AssessmentOutlined, FiberManualRecord as Circle } from '@material-ui/icons';
import { CheckCircleOutlined } from '@material-ui/icons';
import { CancelOutlined } from '@material-ui/icons';
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
         {testGroups.map(testGroup => (
               <TestCollection key={testGroup.id} sx={{backgroundColor: testGroupColor(testGroup)}}>
                  <TestHeader>
                     <AssessmentOutlined />
                     <TestsTitle sx={{fontFamily: "subTitle"}}>{testGroup.title}</TestsTitle>
                  </TestHeader> 
                  <hr style={{marginBottom: "0.6rem", borderColor: "gray"}} />
                  {testGroup.tests.map((test, index) => (
                     <TestDisplay key={test.id}>
                        <TestStripe sx={{backgroundColor: testStripeColor(test)}} />
                        <TestBlock sx={{fontFamily:"body", backgroundColor: testColor(test)}}>
                           <TestDescription>{test.id}</TestDescription>
                           <TestResult>{test.error}</TestResult>
                        </TestBlock>
                     {test.success != null &&
                        <TestLogo sx={{backgroundColor: testColor(test)}}>
                           {test.success &&
                              <CheckCircleOutlined sx={{color: "successGreen"}} />
                           }
                           {!test.success &&
                              <CancelOutlined sx={{color: "error"}} />
                           }
                        </TestLogo>
                     }
                     
                  </TestDisplay>
                  ))}
               </TestCollection>
         ))}
      </LabContent>
   )
   function testStripeColor({ success }: Test) {
      if (success == null) {
         return 'accent'
      }
      if (success) {
         return 'successGreen'
      }
      return 'error'
   }
   function testGroupColor({ success }: TestGroup) {
      if (success == null) {
         return 'accentBright'
      }
      if (success) {
         return 'lightGreen'
      }
      return 'lightRed'
   }
   function testColor({ success }: Test) {
      if (success == null) {
         return 'lightGray'
      }
      if (success) {
         return 'lighterGreen'
      }
      return 'lighterRed'
   }
}

const TestHeader = styled.div`
   display: flex;
   align-items: center;
   margin: 1.4rem 0 0.5rem 0;
   padding-left: 0.7rem;
`

const TestStripe = styled.div`
   flex: 20px 0 0;
`

const TestLogo = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   flex: 70px 0 0;
`

const TestBlock = styled.div`
   flex: 1 0 0;
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
   padding: 0 0.7rem;
`

const TestDisplay = styled.div`
   display: flex;
   margin: 0.7rem 0.7rem;
`
const TestCount = styled.div`
   flex: 0 0 1rem;
   font-weight: bold;
   padding-top: 0.3rem;
   padding-bottom: 0.3rem;
`
const TestDescription = styled.div`
   flex: 1 0 0;
   font-size: 0.9rem;
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
   font-size: 0.8rem;
`

export { TestsComponent }

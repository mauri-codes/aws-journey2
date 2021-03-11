/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React from 'react'
import { TestGroup, Test } from "../../types"
import { AssessmentOutlined, FiberManualRecord as Circle } from '@material-ui/icons';
import { CheckCircleOutlined } from '@material-ui/icons';
import { CancelOutlined } from '@material-ui/icons';

function TestResultsComponent ({testGroups}: {testGroups: TestGroup[]}) {
    return (
        <div>
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
        </div>
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

export { TestResultsComponent }

const TestsTitle = styled.div`
   font-weight: bold;
   margin-left: 0.5rem;
`

const TestCollection = styled.div`
   padding: 0.5rem 0.7rem;
`

const TestDisplay = styled.div`
   display: flex;
   margin: 0.7rem 0.7rem;
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
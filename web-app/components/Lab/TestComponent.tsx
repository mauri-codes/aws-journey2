import styled from "@emotion/styled"
import { TestSection } from "../../types"
import { LabContent, SubTitle, ContentHeader } from "./styled"



function TestsComponent ({testSection}: {testSection: TestSection}) {
   return (
      <LabContent>
         <SubTitle>Tests</SubTitle>
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


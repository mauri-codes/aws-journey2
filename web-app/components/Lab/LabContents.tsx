/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import { Tabs } from "./styled";
import { LabData } from "../../types";
import { OverviewComponent } from "./OverviewComponent";
import { TestsComponent } from "./TestComponent";

interface LabContentsInput {
   tabList: JSX.Element[]
   activeTab: Tabs
   lab: LabData
}
function LabContentsComponent ({tabList, activeTab, lab}: LabContentsInput) {
   return (
      <div>
         <LabTitle sx={{fontFamily: "title"}}>S3 static Website</LabTitle>
      <LabContents>
         {activeTab === "Overview" &&
            <OverviewComponent overview={lab.overview} />
         }
         {activeTab === "Tests" &&
            <TestsComponent testSection={lab.testSection} />
         }
         <LabMenu>
            {tabList}
         </LabMenu>
      </LabContents>
      </div>
   )
}

export { LabContentsComponent }

const LabContents = styled.div`
   display: flex;
`
const LabTitle = styled.h1`
   text-align: center;
`

const LabMenu = styled.div`
   display: flex;
   flex-direction: column;
   flex: 1 0 0;
   padding-left: 1rem;
   padding-top: 5.5rem;
   font-size: 1.1rem;
   min-height: 60vh;
`

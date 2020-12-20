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
      <LabContents>
         <LabMenu>
            {tabList}
         </LabMenu>
         {activeTab === "Overview" &&
            <OverviewComponent overview={lab.overview} />
         }
         {activeTab === "Tests" &&
            <TestsComponent testSection={lab.testSection} />
         }
      </LabContents>
   )
}

export { LabContentsComponent }

const LabContents = styled.div`
   display: flex;

`

const LabMenu = styled.div`
   display: flex;
   background-color: hsl(100, 10%, 93%);
   flex-direction: column;
   flex: 1 0 0;
   padding-left: 1rem;
   padding-top: 5.5rem;
   font-size: 1.1rem;
   min-height: 60vh;
`

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Overview } from "../../types";
import { LabContent, SubTitle, ContentHeader } from "./styled";

function OverviewComponent ({overview}: {overview: Overview}) {
   return (
      <LabContent
      sx={{fontFamily: "body"}}
      //  sx={{backgroundColor: "backgroundBrighter"}}
       >
         <SubTitle sx={{fontFamily: "subTitle"}}>Overview</SubTitle>
         <p>{overview.description}</p>
         <ContentHeader sx={{fontFamily: "subTitle"}}>Goals</ContentHeader>
         <ul>
            {overview.goals.map(goal => <li key={goal}>{goal}</li>)}
         </ul>
      </LabContent>
   )
}

export { OverviewComponent }

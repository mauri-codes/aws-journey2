import { Overview } from "../../types";
import { LabContent, SubTitle, ContentHeader } from "./styled";

function OverviewComponent ({overview}: {overview: Overview}) {
   return (
      <LabContent>
         <SubTitle>Overview</SubTitle>
         <p>{overview.description}</p>
         <ContentHeader>Goals</ContentHeader>
         <ul>
            {overview.goals.map(goal => <li key={goal}>{goal}</li>)}
         </ul>
      </LabContent>
   )
}

export { OverviewComponent }

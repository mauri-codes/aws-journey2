/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Overview } from "../../types";
import { useContext, useEffect, useState } from "react"
import { LabContent, SubTitle, ContentHeader } from "./styled"
import { StoreContext } from "../../state/RootStore"
import { useRouter } from 'next/router'
import { getS3SignedUrl } from "../../queries/s3";

function OverviewComponent ({overview}: {overview: Overview}) {
   const { authStore } = useContext(StoreContext)
   const [ infraImg, setInfraImg ] = useState(null)
   const router = useRouter()
   const { lab_id } = router.query
   useEffect(() => {
      getInfrastructureImage()
   }, [lab_id, authStore.apolloClient])
   return (
      <LabContent
         sx={{fontFamily: "body"}}
       >
         <SubTitle sx={{fontFamily: "subTitle"}}>Overview</SubTitle>
         <p>{overview.description}</p>
         <ContentHeader sx={{fontFamily: "subTitle"}}>Goals</ContentHeader>
         <ul>
            {overview.goals.map(goal => <li key={goal}>{goal}</li>)}
         </ul>
         <ContentHeader sx={{fontFamily: "subTitle"}}>Infrastructure</ContentHeader>
         {infraImg != null &&
            <img src={infraImg} alt=""/>
         }
      </LabContent>
   )
   async function getInfrastructureImage() {
      const apolloQuery = await authStore.gqlQuery(getS3SignedUrl(`labs/${lab_id}/infrastructure.png`))
      if (apolloQuery != null) {
         setInfraImg(apolloQuery.data.getS3SignedUrl.signedUrl)
      }
   }
}

export { OverviewComponent }

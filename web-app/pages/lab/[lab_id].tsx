import { useRouter } from 'next/router'
import { useEffect, useContext, useState } from "react";
import { getLabQuery } from "../../queries/lab";
import styled from "@emotion/styled"
import { LabData } from "../../types";

import { StoreContext } from "../../state/RootStore"


type Tabs = "Overview" | "Tests"

export default function  Lab () {
   const { authStore: { apolloClient } } = useContext(StoreContext)
   const router = useRouter()
   const { lab_id } = router.query
   const [lab, setLab] = useState<LabData>()
   const [activeTab, setActiveTab] = useState<Tabs>("Overview")
   const tabs = ["Overview", "Tests"]
   const tabList = tabs.map((tab: Tabs) => {
      if (tab === activeTab) {
         return <ActiveMenuOption key={tab}>{tab}</ActiveMenuOption>
      } else {
         return <MenuOption
            key={tab}
            onClick={() => setActiveTab(tab)}
            >{tab}</MenuOption>
      }
   })

   useEffect(() => {
      if (apolloClient){
         getCurrentLab()
      }
      async function getCurrentLab() {
         const apolloQuery = await apolloClient.query({
            query: getLabQuery(lab_id)
         })
         const response = apolloQuery.data.getLab
         if (response.success) {
            setLab(response.lab)
            console.log("success")
         } else {
            console.log("fail")
         }
      }
   }, [apolloClient])

   return (
      <LabContainer>
         {lab &&
            <>
               <TitleContainer>
                  <Title>
                     {lab.title}
                  </Title>
               </TitleContainer>
               <LabContents>
                  <LabContent>
                     content
                  </LabContent>
                  <LabMenu>
                     {tabList}
                  </LabMenu>
               </LabContents>
            </>
         }
      </LabContainer>
   )
}

const LabContainer = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
`
const TitleContainer = styled.div`
   padding: 2rem 1.4rem;
   border-bottom: 1px solid gray;
`
const Title = styled.div`
   font-size: 2rem;
   font-weight: bold;
`

const LabContents = styled.div`
   display: flex;

`
const LabContent = styled.div`
   flex: 4 0 0;
   margin-top: 1rem;
   padding-left: 2rem;
   padding-right: 1rem;
   padding-bottom: 2rem;
`
const LabMenu = styled.div`
   display: flex;
   flex-direction: column;
   flex: 1 0 0;
   margin-top: 1rem;
   padding-left: 1rem;
   padding-top: 0.5rem;
   border-left: 1px solid gray;
   min-height: 60vh;
`
const MenuOption = styled.div`
   cursor: pointer;
   + * {
      margin-top: 1rem;
   }
   &:hover {
      color: dimgray;
   }
`
const ActiveMenuOption = styled.div`
   font-weight: bold;
   color: rgb(220, 99, 80);
   + * {
      margin-top: 1rem;
   }
`

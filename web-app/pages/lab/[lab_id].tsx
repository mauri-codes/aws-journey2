import { useRouter } from 'next/router'
import { useEffect, useContext, useState } from "react"
import { getLabQuery } from "../../queries/lab"
import styled from "@emotion/styled"
import { LabData } from "../../types"
import { Tabs } from "../../components/Lab/styled";

import { StoreContext } from "../../state/RootStore"
import { LabContentsComponent } from "../../components/Lab/LabContents"

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
               <LabContentsComponent
                  tabList={tabList}
                  activeTab={activeTab}
                  lab={lab}
               />
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
   /* border-bottom: 1px solid gray; */
`
const Title = styled.div`
   font-size: 2rem;
   font-weight: bold;
`

const MenuOption = styled.div`
   padding-left: 10px;
   cursor: pointer;
   + * {
      margin-top: 1rem;
   }
   &:hover {
      color:  rgb(245, 122, 56);
   }
`
const ActiveMenuOption = styled.div`
   padding-left: 6px;
   border-left: 4px solid rgb(245, 122, 56);
   font-weight: bold;
   color:black;
   + * {
      margin-top: 1rem;
   }
`

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRouter } from 'next/router'
import { useEffect, useContext, useState } from "react"
import { getLabQuery } from "../../queries/lab"
import styled from "@emotion/styled"
import { LabData } from "../../types"
import { Tabs } from "../../components/Lab/styled";

import { StoreContext } from "../../state/RootStore"
import { LabContentsComponent } from "../../components/Lab/LabContents"

export default function  Lab () {
   const { authStore } = useContext(StoreContext)
   const router = useRouter()
   const { lab_id } = router.query
   const [lab, setLab] = useState<LabData>()
   const [activeTab, setActiveTab] = useState<Tabs>("Overview")
   const tabs = ["Overview", "Tests"]
   const tabList = tabs.map((tab: Tabs) => {
      if (tab === activeTab) {
         return <ActiveMenuOption
            sx={{borderColor: "primary", fontFamily: "bodyBold"}}
            key={tab}
         >{tab}</ActiveMenuOption>
      } else {
         return <MenuOption
            sx={{"&:hover": {color:  "primary"}, borderColor: "primaryBright", fontFamily: "body"}}
            key={tab}
            onClick={() => setActiveTab(tab)}
            >{tab}</MenuOption>
      }
   })

   useEffect(() => {
      getCurrentLab()
      async function getCurrentLab() {
         const apolloQuery = await authStore.gqlQuery(getLabQuery(lab_id))
         if ( apolloQuery != null) {
            const response = apolloQuery.data.getLab
            if (response.success) {
               setLab(response.lab)
               console.log("success")
            } else {
               console.log("fail")
            }
         }
      }
   }, [authStore, lab_id])

   return (
      <LabContainer>
         {lab &&
            <LabContentsComponent
               tabList={tabList}
               activeTab={activeTab}
               lab={lab}
            />
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
   display: flex;
   align-items: center;
   font-size: 1.1rem;
   padding-left: 15px;
   height: 2.5rem;
   border-left-style: solid;
   border-left-width: 8px;
   border-color: gray;
   cursor: pointer;
   /* + * {
      margin-top: 0.5rem;
   } */
`
const ActiveMenuOption = styled.div`
   display: flex;
   align-items: center;
   font-size: 1.1rem;
   cursor: default;
   border-left-style: solid;
   border-left-width: 8px;
   height: 2.5rem;
   padding-left: 15px;
   font-weight: bold;
   color:black;
   /* + * {
      margin-top: 0.5rem;
   } */
`

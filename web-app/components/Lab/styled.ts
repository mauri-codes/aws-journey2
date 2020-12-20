
import styled from "@emotion/styled"

const LabContent = styled.div`
   flex: 4 0 0;
   background-color:hsl(100, 10%, 95%);
   padding-left: 2rem;
   padding-top: 1rem;
   padding-right: 1rem;
   padding-bottom: 2rem;
`

const SubTitle = styled.div`
   font-size: 1.5rem;
   margin: 1rem 0 1.5rem 0;
   font-weight: bold;
`


const ContentHeader = styled.div`
   font-size: 1.1rem;
   margin: 1rem 0 0.5rem 0;
   font-weight: bold;
`

export type Tabs = "Overview" | "Tests"

export { LabContent, SubTitle, ContentHeader }

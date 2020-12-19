/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import { useContext } from "react";
import { HeaderComponent } from "./Header"
import { observer } from "mobx-react"
import { AuthenticatorComponent } from "./Authenticator"
import { StoreContext } from "../state/RootStore"


const LayoutComponent = observer(({children}) => {
   const { authStore } = useContext(StoreContext)
   authStore.setCurrentSession()
   return (
      <div>
         <AuthenticatorComponent>
            <HeaderComponent />
            <Content sx={{backgroundColor: "background"}}>
               {children}
            </Content>
         </AuthenticatorComponent>
      </div>
   )}    
)

export { LayoutComponent }

const Content = styled.div`
   padding-top: 4.5rem;
   min-height: 100vh;
   
   @media only screen and (max-width: 768px) {
      padding-left: 0;
      padding-right: 0;
   }
   @media only screen and (min-width: 768px) {
      padding-left: 5vw;
      padding-right: 5vw;
   }
   @media only screen and (min-width: 1200px) {
      padding-left: 10vw;
      padding-right: 10vw;
   }
`

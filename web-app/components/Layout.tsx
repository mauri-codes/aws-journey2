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

`

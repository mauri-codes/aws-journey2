/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify';
import { useEffect } from "react";

const HeaderComponent = () => {
   useEffect(() => {
      currentSession()
   })
   return (
      <Header sx={{backgroundColor:"primary"}} >
         <Logo>logo</Logo>
         <Nav>
            <AmplifySignOut />
         </Nav>
      </Header>
   )
   async function currentSession() {
      let x = await Auth.currentUserInfo()
      console.log(x)
   }
}

const Header = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   position: fixed;
   height: 4.5rem;
   width: 100vw;
   padding: 0 1rem;
`

const Logo = styled.div`
   flex: 0 0 4.5rem;
   height: 100%;
`
const Nav = styled.div`
   display: flex;
   justify-content: flex-end;
   flex: 1 0 0;
`

const NavLink = styled.div`
   color: white;
   font-size: 1.1rem;
   padding: 0.7rem 2rem;
   cursor: pointer;
   &:hover {
      background-color: rgba(255, 255, 255, 0.1);
   }
   + * {
      margin-left: 1rem;
   }
`

export { HeaderComponent }
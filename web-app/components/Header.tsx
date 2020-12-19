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
            <NavLink>
               Sign Out
            </NavLink>
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
   padding: 0 0;   
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

const Logo = styled.div`
   flex: 0 0 4.5rem;
   height: 100%;
`
const Nav = styled.div`
   display: flex;
   justify-content: flex-end;
   flex: 1 0 0;
   color: white;
`

const NavLink = styled.div`
   color: white;
   padding: 0.7rem 2rem;
   cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
   + * {
      margin-left: 1rem;
   }
`

export { HeaderComponent }
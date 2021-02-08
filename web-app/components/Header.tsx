/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useEffect } from "react"
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HeaderComponent = () => {
   useEffect(() => {
      currentSession()
   })
   return (
      <Header sx={{backgroundColor:"none"}} >
         <Logo>logo</Logo>
         <Nav>
            <NavLink sx={{ variant: 'header.hover' }} >
               Journeys
            </NavLink>
            <NavLink sx={{ variant: 'header.hover' }} >
               Labs
            </NavLink>
            <NavLink sx={{ variant: 'header.hover' }} >
               thompson <FontAwesomeIcon icon={faAngleDown} />
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
   height: 4rem;
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
`

const NavLink = styled.div`
   color: black;
   padding: 0.7rem 1rem;

   cursor: pointer;
   &:last-child {
      margin-left: 2rem;
   }
   /* + * {
      margin-left: 1rem;
   } */
`

export { HeaderComponent }
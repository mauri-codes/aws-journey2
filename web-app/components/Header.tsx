/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useEffect, useState } from "react"
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pageActions } from "../events/publishers";

const HeaderComponent = () => {
   let [ userMenu, setUserMenu ] = useState<boolean>(false)
   useEffect(() => {
      currentSession()
   })
   useEffect(() => {
      let subscription = pageActions.subscribe((event) => {
         setUserMenu(false)
      })
      return () => subscription.unsubscribe()
   }, [])
   return (
      <Header sx={{backgroundColor:"none", fontFamily: "body"}} >
         <Logo sx={{fontFamily: "ocr", color: "accent"}}><div>AWS Journey</div> </Logo>
         <Nav>
            <NavLink sx={{ variant: 'header.hover' }} >
               Journeys
            </NavLink>
            <NavLink sx={{ variant: 'header.hover' }} >
               Labs
            </NavLink>
            <NavLink onClick={(event) => {event.stopPropagation(); setUserMenu(!userMenu)}}>
               <div sx={{ variant: 'header.hover', color: userMenu?"primary": "black"}} >
                  thompson <FontAwesomeIcon icon={faAngleDown} />
               </div>
               {userMenu &&
                  <UserMenu sx={{ backgroundColor: "background", borderColor: "primary" }}>
                     <UserMenuOption sx={{"&:hover": { backgroundColor: "primaryBright"}}}> Profile </UserMenuOption>
                     <UserMenuOption sx={{"&:hover": { backgroundColor: "primaryBright"}}}> Credentials </UserMenuOption>
                     <UserMenuOption sx={{"&:hover": { backgroundColor: "primaryBright"}}}> Sign Out </UserMenuOption>
                  </UserMenu>
               }
            </NavLink>
         </Nav>
      </Header>
   )
   async function currentSession() {
      let x = await Auth.currentUserInfo()
      console.log(x)
   }
}

const UserMenu = styled.div`
   display: flex;
   flex: 0 0 0;
   cursor: pointer;
   color: black;
   font-size: 0.9rem;
   flex-direction: column;
   position: absolute;
   top: 90%;
   right: 0.7rem;
   border-style: solid;
   border-width: 0.5px;
   margin-bottom: 0;
`
const UserMenuOption = styled.div`
   padding: 0.5rem 1rem;
   font-size: 0.9rem;
`

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
   display: flex;
   align-items: center;
   flex: 0 0 10rem;
   height: 100%;
   font-size: 1.4rem;
`
const Nav = styled.div`
   display: flex;
   justify-content: flex-end;
   flex: 1 0 0;
`

const NavLink = styled.div`
   position: relative;
   color: black;
   padding: 0.7rem 1rem;
   font-size: 0.9rem;
   cursor: pointer;
   &:last-child {
      margin-left: 2rem;
   }
   /* + * {
      margin-left: 1rem;
   } */
`

export { HeaderComponent }
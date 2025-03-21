/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styled from "@emotion/styled"
import React, { useState, useContext, useEffect } from 'react'
import { faUser, faKey, faPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StoreContext } from "../state/RootStore"
import { AWSCredentialsComponent } from "../components/Profile/AWSCredentials";
import { Person } from '@material-ui/icons';
import { SecondaryColor } from '../styles/DefaultTheme'

const MenuOptions = [{
   text: "Profile",
   icon: faUser
},{
   text: "AWS Credentials",
   icon: faKey
},{
   text: "Journeys",
   icon: faPlane
}]


export default function UserProfile() {
   const { authStore } = useContext(StoreContext)
   const [ menuIndex, setMenuIndex ] = useState(0)
   const menuOptionHover = {
      marginLeft: "5px",
      "&:hover": {
         backgroundColor: "accentBright"
      }
   }
   const selectedOption = {
      color: "accent",
      borderLeft: "5px solid " + SecondaryColor,
      "&:hover": {
         backgroundColor: "accentBright"
      }
   }
   return (
      <div sx={{fontFamily: "body"}}>
         <User>
               <Person style={{fontSize:100}} color={"secondary"} />
               <UserName sx={{fontFamily: "title"}}> {authStore.username} </UserName>
         </User>
         <Profile>
               <ProfileMenu>
                  <ProfileMenuContainer
                     // sx={{backgroundColor: "accentBright"}}
                  >
                     {MenuOptions.map((option, index) => (
                        <MenuOption
                           sx={menuIndex === index ? selectedOption :menuOptionHover}
                           onClick={() => setMenuIndex(index)}
                           key={index + "option"}
                           >
                              <MenuIcon>
                                 <FontAwesomeIcon icon={option.icon} />
                              </MenuIcon>
                              <MenuText>{option.text}</MenuText>
                        </MenuOption>
                     ))}
                  </ProfileMenuContainer>
               </ProfileMenu>
               <ProfileContent>
                  <SubMenuTitle sx={{fontFamily: "subTitle"}}>{MenuOptions[menuIndex].text}</SubMenuTitle>
                  {menuIndex == 0 &&
                     <UserProfileMenu>
                           <p><b sx={{fontFamily: "bodyBold"}}>Email: </b> {authStore.email} </p>
                     </UserProfileMenu>
                  }
                  {menuIndex == 1 &&
                     <AWSCredentialsComponent />
                  }
                  {menuIndex == 2 &&
                     <div>Journeys</div>
                  }
               </ProfileContent>
         </Profile>
      </div>
   )
}

const User = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`

const SubMenuTitle = styled.h3`
    margin: 1rem 0;
`

const UserProfileMenu = styled.div`

`


const UserName = styled.h2`
   margin-bottom: 2rem;
`

const UserImage = styled.img`
   width: 5rem;
   height: 5rem;
   margin: 3rem 2rem 1rem 2rem;
`

const Profile = styled.div`
   display: flex;
`
const ProfileMenuContainer = styled.div`
   display: flex;
   flex-direction: column;
   border: 1px solid lightgray;
   padding: 1rem 1.5rem 1rem 1.5rem;

`
const ProfileMenu = styled.div`
   flex: 2 0 0;
`
const MenuOption = styled.div`
   display: flex;
   align-items: center;
   padding-left: 0.5rem;
   width: 100%;
   padding-top: 0.5rem;
   padding-bottom: 0.5rem;
   cursor: pointer;
`

const MenuIcon = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   flex: 1.5rem 0 0;
   height: 1.5rem;
`
const MenuText = styled.div`
   flex: 1 0 0;
   padding-left: 0.6rem;
`

const ContentTitle = styled.div`

`

const ProfileContent = styled.div`
   flex: 5 0 0;
   margin-left: 2rem;
`

export { UserProfile }

/** @jsxRuntime classic */
/** @jsx jsx */
import themeUI, { jsx } from 'theme-ui'
import styled from "@emotion/styled";


function LayoutComponent({children}) {
   return (
      <Layout>
         <HeaderComponent />
         <Content>
            {children}
         </Content>
      </Layout>
   )    
}

export { LayoutComponent }

const Layout = styled.div`

`
const Content = styled.div`
   padding-top: 4.5rem;
   min-height: 100vh;
   background-color: lightcyan;

`
function HeaderComponent() {
   return (
      <Header>
         <Logo>logo</Logo>
         <Nav>
            <NavLink>Login</NavLink>
            <NavLink>Signup</NavLink>
         </Nav>
      </Header>
   )
}

const Header = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   position: fixed;
   height: 4.5rem;
   width: 100vw;
   background-color: lightblue;
   padding: 0 1rem;
`

const Logo = styled.div`
   flex: 0 0 4.5rem;
   height: 100%;
   background-color: lightgoldenrodyellow;
`
const Nav = styled.div`
   display: flex;
   justify-content: flex-end;
   flex: 1 0 0;
`

const NavLink = styled.div`
   height: 70%;
   background-color: lightcoral;
   padding: 1rem 2rem;
`


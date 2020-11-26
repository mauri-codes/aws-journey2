import { ThemeProvider } from 'theme-ui'
import { DefaultTheme } from "../styles/DefaultTheme"
import { Global } from '@emotion/core'
import { GlobalStyles } from "../styles/GlobalStyles"
import { LayoutComponent } from "../components/Layout"
import { Store, StoreContext } from "../state/RootStore"
import '../styles/app.css'

function MyApp({ Component, pageProps }) {
   return (
      <>
         <Global styles={GlobalStyles} />
         <StoreContext.Provider value={Store}>
            <ThemeProvider theme={DefaultTheme}>
               <LayoutComponent>
                  <Component {...pageProps} />
               </LayoutComponent>
            </ThemeProvider>
         </StoreContext.Provider>
      </>
   )
}

export default MyApp

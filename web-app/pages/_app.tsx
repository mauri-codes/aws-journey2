import GlobalStyles from '../GlobalStyles'
import { ThemeProvider } from "styled-components";
import { DefaultTheme } from '../themes/DefaultTheme'

function MyApp({ Component, pageProps }) {
  return (
   <>
      <GlobalStyles />
      <ThemeProvider theme={DefaultTheme}>
         <Component {...pageProps} />
      </ThemeProvider>
     
   </>
  )
}

export default MyApp

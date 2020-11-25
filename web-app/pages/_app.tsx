
import Amplify from 'aws-amplify';
import { ThemeProvider } from 'theme-ui'
import { DefaultTheme } from "../styles/DefaultTheme";
import { Global } from '@emotion/core'
import { GlobalStyles } from "../styles/GlobalStyles";
import { LayoutComponent } from "../components/Layout";


Amplify.configure({
   Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_CLIENT_ID
   }
});

function MyApp({ Component, pageProps }) {
  return (
   <>
      <Global styles={GlobalStyles} />
      <ThemeProvider theme={DefaultTheme}>
         <LayoutComponent>
            <Component {...pageProps} />
         </LayoutComponent>
      </ThemeProvider>
   </>
  )
}

export default MyApp

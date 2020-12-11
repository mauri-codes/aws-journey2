import React, { useState, useEffect, useContext, Fragment } from 'react';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import { StoreContext } from "../state/RootStore";
import { AuthInfo } from "../state/AuthStore";
import Amplify from 'aws-amplify'
import { useRouter } from 'next/router'

Amplify.configure({
   Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_CLIENT_ID
   }
});

const ProtectedRoutes = [
    "/labs"
]

const AuthenticatorComponent = ({children}) => {
   const { pathname } = useRouter()
   const [authState, setAuthState] = useState<AuthState>();
   const [user, setUser] = useState<object | undefined>();
   const protectedRoute = ProtectedRoutes.includes(pathname)
   

   const signUpFields = [
      {
        type: "email",
      },
      {
        type: "username",
      },
      {
        type: "password",
      }
   ]
   const { authStore } = useContext(StoreContext)

   useEffect(() => {
      return onAuthUIStateChange((nextAuthState, authData) => {
         if (nextAuthState === 'signedin') {
            let accessToken = authData["signInUserSession"]["accessToken"]["jwtToken"]
            let idToken = authData["signInUserSession"]["idToken"]["jwtToken"]
            let payload = authData["signInUserSession"]["idToken"]["payload"]
            let { email } = payload
            let username = payload["cognito:username"]
            let authInfo: AuthInfo = { accessToken, idToken, email, username }
            authStore.setAuthInfo(authInfo)
         }
         if (nextAuthState === 'signedout') {
            authStore.destroyAuthInfo()
         }
         setAuthState(nextAuthState);
         setUser(authData)
      });
   }, []);
   const authenticated = authState === AuthState.SignedIn && user
   return authenticated || (!authenticated && !protectedRoute) ? (
      <Fragment>{children}</Fragment> 
   ) : (
   <AmplifyAuthenticator>
      <AmplifySignUp
         headerText="Sign Up"
         formFields={signUpFields}
         slot="sign-up"
      />
      <div
         slot="confirm-sign-up"
         >
            We sent you an email. Please confirm your account, then <a href="/labs" >Sign in</a>
      </div>
   </AmplifyAuthenticator>
  );
}

export { AuthenticatorComponent }

import React, { useState, useEffect, Fragment } from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
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

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);
    const authenticated = authState === AuthState.SignedIn && user
  return authenticated || (!authenticated && !protectedRoute) ? (
    <Fragment>{children}</Fragment> 
  ) : (
    <AmplifyAuthenticator />
  );
}

export { AuthenticatorComponent }

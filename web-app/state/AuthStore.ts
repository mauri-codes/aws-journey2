import { makeAutoObservable } from "mobx"
import { DocumentNode } from '@apollo/client'
import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Auth } from 'aws-amplify'
import axios from 'axios'

export interface AuthInfo {
   accessToken: string
   idToken: string
   username: string
   email: string
}

const httpLink = createHttpLink({
   uri: 'https://api.aws-journey.net/graphql',
});

class AuthStore {
   accessToken: string | null
   idToken: string | null
   username: string | null
   email: string | null
   apolloClient: ApolloClient<NormalizedCacheObject>
   endpoint: string
   constructor() {
      makeAutoObservable(this)
      this.endpoint = "https://api.aws-journey.net"
   }
   async setCurrentSession() {
      try {
         const session = await Auth.currentSession()
         console.log(session)
         if (session["idToken"]["jwtToken"] != this.idToken) {
            console.log("DIFFERENT KEYS")
            this.accessToken = session["accessToken"]["jwtToken"]
            this.idToken = session["idToken"]["jwtToken"]
            const { payload: { email } } = session["idToken"]
            const { payload: { username }} = session["accessToken"]
            this.email = email
            this.username = username
            this.createApolloClient()
         }
      }
      catch(error) {
         this.destroyAuthInfo()
      }
   }
   destroyAuthInfo() {
      this.accessToken = null
      this.idToken = null
      this.username = null
      this.email = null
   }
   setAuthInfo(authInfo: AuthInfo) {
      this.accessToken = authInfo.accessToken
      this.idToken = authInfo.idToken
      this.username = authInfo.username
      this.email = authInfo.email
      this.createApolloClient()
   }
   createApolloClient() {
      console.log("creating...")
      const authLink = setContext((_, { headers }) => {
         const token = this.idToken
         return {
            headers: {
               ...headers,
               authorization: token ? `Bearer ${token}` : "",
            }
         }
      })
      this.apolloClient = new ApolloClient({
         link: authLink.concat(httpLink),
         cache: new InMemoryCache()
      })
   }
   async post(route: string, data: any) {
      await this.setCurrentSession()
      const config = {
         headers: { Authorization: `Bearer ${this.idToken}` }
     };
      return await axios.post(`${this.endpoint}${route}`, data, config)
   }
   async gqlQuery(query: DocumentNode) {
      await this.setCurrentSession()
      return await this.apolloClient.query({query})
   }
   async gqlMutation(mutation: DocumentNode) {
      await this.setCurrentSession()
      return await this.apolloClient.mutate({mutation})
   }
}

const authStore = new AuthStore()

export { authStore }

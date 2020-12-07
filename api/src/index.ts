import { ApolloServer, gql, Config  } from 'apollo-server'
import { appSchema } from "./schema";
import { AWSJourneyDataSource } from "./dataSources/AwsJourney";
import { IResolvers } from 'graphql-tools';

export interface Context {
   dataSources: {
      AWSJourney: AWSJourneyDataSource;
   };
}
const dataSources = (): Context['dataSources'] => {
   return {
      AWSJourney: new AWSJourneyDataSource()
   };
 };

const resolvers: IResolvers = {
    Query: {
        getLab: async (_source, {id}, { dataSources }) => {
            return dataSources.AWSJourney.getLab(id)
        }
    },
    Mutation: {
        setLab: async (_source, {id, description}, { dataSources }) => {
            return dataSources.AWSJourney.updateLab(id, {description})
        }
    }
}

const typeDefs = appSchema

const server = new ApolloServer({ typeDefs, resolvers, dataSources });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

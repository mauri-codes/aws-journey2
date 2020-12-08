import { ApolloServer } from 'apollo-server'
import { appSchema } from "./schema";
import { resolvers } from "./resolvers";
import { dataSources } from "./dataSources/rootDS";

const server = new ApolloServer({ typeDefs: appSchema, resolvers, dataSources });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

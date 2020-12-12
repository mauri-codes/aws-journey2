import { ApolloServer } from 'apollo-server-lambda'
import { appSchema } from "./src/schema"
import { resolvers } from "./src/resolvers"
import { dataSources } from "./src/dataSources/rootDS"

const server = new ApolloServer({ typeDefs: appSchema, resolvers, dataSources })

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    },
})

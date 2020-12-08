import { ApolloServer } from 'apollo-server-lambda'
import { appSchema } from "./schema"
import { resolvers } from "./resolvers"
import { dataSources } from "./dataSources/rootDS"

const server = new ApolloServer({ typeDefs: appSchema, resolvers, dataSources })

exports.graphqlHandler = server.createHandler()

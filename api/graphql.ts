import { ApolloServer } from 'apollo-server-lambda'
import { appSchema } from "./src/schema"
import { resolvers } from "./src/resolvers"
import { dataSources } from "./src/dataSources/rootDS"
// var server2 = require('apollo-server-lambda')

// exports.graphqlHandler = server2.graphqlLambda({ schema: appSchema });
// exports.graphiqlHandler = server2.graphiqlLambda({
//   endpointURL: '/Prod/graphql',
// });

const server = new ApolloServer({ typeDefs: appSchema, resolvers, dataSources })

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    },
})

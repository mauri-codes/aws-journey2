import { ApolloServer } from 'apollo-server-lambda'
import { appSchema } from "./src/schema"
import { resolvers } from "./src/resolvers"
import { dataSources } from "./src/dataSources/rootDS"
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda"

let handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
    let user = (event.requestContext.authorizer || {})["claims"]["cognito:username"]
    const server = new ApolloServer({
        typeDefs: appSchema,
        resolvers: resolvers(user),
        dataSources    
    })
    return server.createHandler({
        cors: {
            origin: '*',
            credentials: true
        }
    })(event, context, callback)
}


exports.graphqlHandler = handler

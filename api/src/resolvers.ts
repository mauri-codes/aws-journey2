import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
    Query: {
        getLab: async (_source, {id}, { dataSources }) => {
            return dataSources.AWSJourney.getLab(id)
        }
    },
    Mutation: {
        setLab: async (_source, {lab, overview, test}, { dataSources }) => {
            return dataSources.AWSJourney.updateLab({...lab, overview, test})
        }
    }
}

export { resolvers }

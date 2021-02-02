import { IResolvers } from 'graphql-tools'
import { AWSJourneyDataSource } from "./dataSources/AwsJourneyDS"


interface DataSourcesObject {
    dataSources: {
        AWSJourney: AWSJourneyDataSource
    }
}

const resolvers: (user: string) => IResolvers = (user) => {
    return {
        Query: {
            getLab: async (_source, {id}, { dataSources }: DataSourcesObject) => {
                return dataSources.AWSJourney.getLab(id)
            }
        },
        Mutation: {
            setLab: async (_source, {lab, overview, test}, { dataSources }: DataSourcesObject) => {
                return dataSources.AWSJourney.updateLab({...lab, overview, test})
            },
            setAWSCredentials: async (_source, { credentials }, { dataSources }: DataSourcesObject) => {
                return dataSources.AWSJourney.setAWSCredentials(credentials, user)
            }
        }
    }
}

export { resolvers }

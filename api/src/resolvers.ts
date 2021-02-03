import { IResolvers } from 'graphql-tools'
import { LabSource } from "./dataSources/LabDS"
import { UserCredentialsSource } from "./dataSources/UserCredentialsDS";


interface DataSourcesObject {
    dataSources: {
        LabSource: LabSource,
        UserCredentialsSource: UserCredentialsSource
    }
}

const resolvers: (user: string) => IResolvers = (user) => {
    return {
        Query: {
            getLab: async (_source, {id}, { dataSources }: DataSourcesObject) => {
                return dataSources.LabSource.getLab(id)
            },
            getAWSCredentials: async (_source, {}, { dataSources }: DataSourcesObject) => {
                return dataSources.UserCredentialsSource.getAWSCredentials(user)
            }
        },
        Mutation: {
            setLab: async (_source, {lab, overview, test}, { dataSources }: DataSourcesObject) => {
                return dataSources.LabSource.updateLab({...lab, overview, test})
            },
            setAWSCredentials: async (_source, { credentials }, { dataSources }: DataSourcesObject) => {
                return dataSources.UserCredentialsSource.setAWSCredentials(credentials, user)
            },
            deleteAWSCredentials: async (_source, { credentials }, { dataSources }: DataSourcesObject) => {
                return dataSources.UserCredentialsSource.deleteAWSCredentials(credentials, user)
            }
        }
    }
}

export { resolvers }

import { gql } from 'apollo-server'

const appSchema = gql`
   type Query {
      getLab(id: ID!): Lab
   }
   type Mutation {
      setLab(id: ID!, input: setLabInput): Lab
   }
   type Lab {
      id: ID!
      title: String
      overview: Overview
      testSection: TestSection
   }
   type Overview {
      description: String
      goals: [String]
      services: [String]
   }
   type TestSection {
      tests: [String]
   }
   input setLabInput {
      description: String
   }
`;

export { appSchema }

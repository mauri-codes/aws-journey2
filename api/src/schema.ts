import { gql } from 'apollo-server'

const appSchema = gql`
   type Query {
      getLab(id: ID!): Lab
   }
   type Mutation {
      setLab(lab: setLabInput, overview:setOverviewInput, test:setTestInput): Lab
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
      id: ID!
      title: String
   }
   input setOverviewInput {
      description: String
      goals: [String]
      services: [String]
   }
   input setTestInput {
      tests: [String]
   }
`;

export { appSchema }

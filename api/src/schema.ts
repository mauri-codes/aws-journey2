import { gql } from 'apollo-server-lambda'

const appSchema = gql`
   type Query {
      getLab(id: ID!): LabResponse
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
      tests: [Test]
   }
   type Test {
      description: String
      location: String
      order: Int
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
   type LabResponse {
      success: Boolean
      lab: Lab
      message: String
   }
`;

export { appSchema }

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
      testGroups: [TestGroup]
   }
   type TestError {
      code: String
      message: String
   }
   type Test {
      id: String
      errors: [TestError]
   }
   type TestGroup {
      id: String
      title: String
      tests: [Test]
      errors: [TestError]
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
      testGroups: [String]
   }
   type LabResponse {
      success: Boolean
      lab: Lab
      message: String
   }
`;

export { appSchema }

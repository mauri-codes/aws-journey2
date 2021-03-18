import { gql } from 'apollo-server-lambda'

const appSchema = gql`
   type Query {
      getLab(id: ID!): LabResponse
      getAWSCredentials(user: String): AWSCredentialsResponse
      getS3SignedUrl(path: String): SigneUrlResponse
   }
   type Mutation {
      setLab(lab: setLabInput, overview:setOverviewInput, test:setTestInput): Lab
      setAWSCredentials(credentials: SetCredentialsInput): ResponseState
      deleteAWSCredentials(credentials: DeleteCredentialsInput): ResponseState
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
      testData: TestData
   }
   type TestData {
      tag: String
      testParams: [String]
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
   input SetCredentialsInput {
      accessKeyId: String
      secret: String
      name: String
      mainRegion: String
      secondaryRegion: String
   }
   input DeleteCredentialsInput {
      name: String
   }
   type SigneUrlResponse {
      success: Boolean
      signedUrl: String
   }
   type AWSCredentialsResponse {
      success: Boolean
      credentialsGroup: [AWSCredentials]
   }
   type AWSCredentials {
      accessKeyId: String
      secret: String
      name: String
      mainRegion: String
      secondaryRegion: String
   }
   type ResponseState {
      success: Boolean
      message: String
      data: String
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

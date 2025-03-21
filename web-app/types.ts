export interface Error {
   code: string
   message: string
}

export interface Test {
   id: string
   success?: boolean
   errors: Error[]
   error?: string
}

export interface TestGroup {
   id: string
   title: string
   tests: Test[]
   success?: boolean
   errors: Error[]
}

export interface Overview {
   description: string
   goals: string[]
   services: string[]
}

export interface TestSection {
   testGroups: TestGroup[]
   testData: {
      tag: string,
      testParams: string[]
   }
}

export interface LabData {
   title
   overview: Overview
   testSection: TestSection
   labCompleted: boolean
}

export interface AWSCredential {
   name?: string
   secret?: string
   accessKeyId?: string
   mainRegion?: string
   secondaryRegion?: string
}

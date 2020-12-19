

interface Error {
   code: string
   message: string
}

interface Test {
   id: string
   errors: Error[]
}

interface TestGroup {
   id: string
   title: string
   tests: Test[]
   errors: Error[]
}

export interface LabData {
   title
   overview: {
      Description: string
      Goals: string[]
      Services: string[]
   }
   testGroups: TestGroup[]
}

import { DynamoDataSource, DynamoRecord } from "./DynamoDS";
import { Lab, Overview, TestSection, LabResponse } from "../generated/graphql";
import { Catch } from "../decorators";

type OverviewRecord = DynamoRecord & Overview
type TestSectionRecord = DynamoRecord & TestSection
type LabRecord = DynamoRecord & Lab

type Record = OverviewRecord | TestSectionRecord | LabRecord | null | undefined

class LabSource extends DynamoDataSource {
   constructor() {
      super('aws-journey', 'pk')
   }
   @Catch
   async getLab(id: string, user:string) {
      let labData = {}
      let queryResult = await this.query(`lab_${id}`)
      if (queryResult?.length === 0) {
         throw "No record found"
      }
      let testGroups: any[] = getTestGroups()
      let summaryLab = getSummaryLab()
      if (testGroups.length != 0 && summaryLab) {
         let testData = summaryLab["testData"]
         summaryLab["testSection"] = {
            testGroups,
            testData
         }
      }
      if (summaryLab) {
         labData = (summaryLab["data"] || {});
      }
      const lab = {
         ...summaryLab,
         ...labData,
         ...{
            labCompleted: await this.getUserLabStatus(id, user)
         }
      }      
      return {
         success: true,
         lab
      }
      function getTestGroups() {
         let testGroups: any[] = []
         queryResult = queryResult?.flatMap(record => {
            if (record["sk"].startsWith("testgroup")) {
               delete record.sk
               delete record.pk
               testGroups.push(record)
               return []
            }
            return [record]
         })
         return testGroups
      }
      function getSummaryLab() {
         let summaryLab = queryResult?.reduce((acc, item) => {
               let location = "data"
               if (item["sk"] == "overview") {
                  location = "overview"
               } if (item["sk"] == "data") {
                  location = "data"
                  item["id"] = id
               } if (item["sk"] == "testData") {
                  location = "testData"
               }
               delete item.sk
               delete item.pk
               acc[location] = item
               return acc
            }, {})
         return summaryLab
      }
   }
   async getUserLabStatus(lab_id: string, user: string) {
      let record: DynamoRecord = {
         pk: `user_${user}#completed`,
         sk: `lab_${lab_id}`
      }
      let response = await this.get(record)
      if (response.Item == null) {
         return false
      }
      return response.Item.status
   }
   async updateLab(lab: Lab) {
      const pk = `lab_${lab.id}`
      let { overview, testSection, ...labParams } = lab
      let labData
      if (Object.keys(lab).length == 0) {
         labData = undefined
      } else {
         labData = labParams
      }
      let records: Record [] = [overview, testSection, labData]
      let sks = ["overview", "tests", pk]
      records = records.flatMap((record, index) => {
            if (record == null) return []
            record["pk"] = pk
            record["sk"] = sks[index]
            return {
               ...record, sk: pk
            }
      })
      const result = await this.batchUpdate(records)
      return lab
   }
   setPK(record:Record, pk:string, sk:string) {
      if (record) {
         record.pk = pk
         record.sk = sk
      }
      return record
   }
}

export { LabSource }

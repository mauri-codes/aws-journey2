import { DynamoDataSource, DynamoRecord } from "./DynamoDS";
import { Lab, Overview, TestSection, LabResponse } from "../generated/graphql";

type OverviewRecord = DynamoRecord & Overview
type TestSectionRecord = DynamoRecord & TestSection
type LabRecord = DynamoRecord & Lab

type Record = OverviewRecord | TestSectionRecord | LabRecord | null | undefined

class AWSJourneyDataSource extends DynamoDataSource{
   constructor() {
      super('aws-journey', 'pk')
   }
   async getLab(id: string) {
      let labData = {}
      try {
         let queryResult = (await this.query(`lab_${id}`))["Items"]
         if (queryResult && queryResult.length == 0) {
            throw 'No record found';
         }
         let tests: any[] = []
         queryResult = queryResult?.flatMap(record => {
            if (record["sk"].startsWith("test")) {
               delete record.sk
               delete record.pk
               tests.push(record)
               return []
            }
            return [record]
         })
         let summaryLab = queryResult?.reduce((acc, item) => {
            let location = "data"
            if (item["sk"] == "overview") {
               location = "overview"
            } if (item["sk"] == "data") {
               location = "data"
               item["id"] = id
            }
            delete item.sk
            delete item.pk
            acc[location] = item
            return acc
         }, {})
         if (tests.length != 0 && summaryLab) {
            summaryLab["testSection"] = {
               tests
            }
         }
         if (summaryLab) {
            labData = (summaryLab["data"] || {});
         }
         const lab = {...summaryLab, ...labData}
         return {
            success: true,
            lab
         }

      } catch(error) {
         return {
            success: false,
            message: error
         }
      }
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

export { AWSJourneyDataSource }

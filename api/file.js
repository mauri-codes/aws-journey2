const AWS = require('aws-sdk')
AWS.config.loadFromPath('./config.json')
const DynamoDB = AWS.DynamoDB
const dynamo = new DynamoDB.DocumentClient()

class AWSJourneyDataSource {
    tableName = 'aws-journey'
    pk = 'pk'
    async getLab(id) {
        let labData = {}
        const queryResult = (await this.query(`lab_${id}`))["Items"]
        let summaryLab = queryResult.reduce((acc, item) => {
           let location
           if (item["sk"] == "overview") {
              location = "tests"
           } else if (item["sk"] == "overview") {
              location = "overview"
           } else {
              location = "data"
              item["id"] = id
           }
           delete item.sk
           delete item.pk
           acc[location] = item
           return acc
        }, {})
        if (summaryLab) {
           labData = (summaryLab["data"] || {});
        }
        const lab = {...summaryLab, ...labData}
  
        return lab
     }
    async updateLab(id, lab) {
       const pk = `lab_${id}`
       let { overview, testSection, ...testData } = lab
       let records = [overview, testSection, testData]
       let sks = ["overview", "test", ""]
       records = records.flatMap((record, index) => {
            if (record == null) return []
            record["pk"] = pk
            return {
                ...record, sk: pk
            }
       })
       console.log(records)
       return await this.batchUpdate(records)      
    }
    setPK(record, pk, sk) {
       if (record) {
          record.pk = pk
          record.sk = sk
       }
       return record
    }
    async query (key) {
       // const attributeValues: any = {}
       // Object.entries(record).forEach(([key, value]) => {
       //    attributeValues[`:${key}`] = value
       // })
       const params = {
          TableName: this.tableName,
          KeyConditionExpression: `${this.pk} = :pk`,
          ExpressionAttributeValues: {
             [`:${this.pk}`]: key
          }
       }
       return dynamo.query(params).promise()
    }
    async batchUpdate(records) {
       records = records.map(record => {
          return {
             PutRequest: {
                Item: {
                   ...record
                }
             }
          }
       })
    console.log(records)
       const params = {
          RequestItems: {
            [this.tableName]: records
          }
       }
       console.log(JSON.stringify(params))
       return dynamo.batchWrite(params).promise()
       // async function UpdateItems(params: any) {
       //    return dynamoDB.batchWriteItem(params, function (err, data) {
       //       if(err) {
       //          console.log("error", JSON.stringify(err))
       //       }
       //       console.log(data)
       //       return data
       //    })
       // }
    }
}


let x = new AWSJourneyDataSource()

// x.query()

// const response = x.getLab("myid22")
// response.then((data, err) => {
//         console.log('00000')
//         console.log(err)
//         console.log("----")
//         console.log(data)    
// })

const response = x.updateLab("myid222", {description: "this is a lab", ls: "this is something else"})
response.then((data, err) => {
    console.log('00000')
    console.log(err)
    console.log("----")
    console.log(data)
})

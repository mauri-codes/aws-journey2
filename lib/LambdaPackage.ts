const fs = require('fs')
import minimist from "minimist"
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const copyFile = util.promisify(fs.copyFile)
const path = require('path')
// const fse = require('fs-extra');

const args = minimist(process.argv.slice(2))

class LambdaPackage {
   directory: string
   constructor(directory: string) {
     this.directory = directory
   }
   async package() {
      try {
         process.chdir(this.directory)
         await exec("rm -rf packaged")
         await exec("tsc")
         await copyFile("package.json", "packaged/package.json")
         await copyFile("package-lock.json", "packaged/package-lock.json")
         process.chdir(this.directory + "/packaged")
         await exec("npm install")
         console.log("successfully packaged Lambda Function")
      }
      catch(error) {
         console.log("error Packaging Lambda Function: " + error)
      }
   }
}

const packageLambda = new LambdaPackage(path.join(__dirname, args.dir))

packageLambda.package()
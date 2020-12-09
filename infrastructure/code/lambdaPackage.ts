const fs = require('fs'); 
const { exec } = require("child_process")
const path = require('path')
// const fse = require('fs-extra');

class PackageLambda {
   constructor(directory) {
     this.directory = directory
   }
   package() {
      process.chdir(this.directory)
      let install = () => {
         process.chdir(this.directory)
         this.copyFile("package.json", "packaged/package.json")
         this.copyFile("package-lock.json", "packaged/package-lock.json")
         this.execute("ls", null)
         process.chdir(this.directory + "/packaged")
         this.execute("npm install", null)
      }
      this.execute("rm -rf packaged")
      this.execute("tsc", install)
      // this.copyDirectory("node_modules", "packaged/node_modules")
      
      process.chdir(__dirname)
   }
   execute(command, callback) {
     exec(command, (error, stdout, stderr) => {
         if (error) {
            console.log(`error: ${error.message}`);
            return;
         }
         if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
         }
         if (callback) {
            callback()
         }
         console.log(`stdout: ${stdout}`);
     });
   }
//    copyDirectory (source, destination) {
//       fse.copySync(source, destination);
//    }
   copyFile(file, copy) {
      fs.copyFile(file, copy, (err) => {
         if (err) { 
            console.log("Error Found:", err); 
         } 
         else {
            console.log("file " + file + " copied")
         } 
      }); 
   }
}

const packageLambda = new PackageLambda(path.join(__dirname, "../../api"))

packageLambda.package()
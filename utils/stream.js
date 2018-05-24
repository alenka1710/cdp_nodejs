import minimist from "minimist"
import fs from "fs"
import path from "path"
import http from "http";
import { promisify } from "util";
import through2 from "through2"
import config from "./../config"
import { csvToJSON } from "./"

const helpText = "This tool will help you to run some stream utilities.\n"  
                "Please provide next options when calling a file to run your operation:\n\n" 
                "--action, -a       Put here a method you want to call\n"  
                "--file, -f         Provide a file you want to be operated with action\n"  
                "--help, -h         Call for hepl"


const convertFromFile = (file) => {
  const reader = fs.createReadStream(file)
  reader.pipe(process.stdout)
  reader.on('end', ()=>console.log('end of file'))
}

const transform = () => {
  process.stdin
    .pipe(through2(function (chunk, enc, cb) {
      const str = chunk.toString()
      const upperStr = str.toUpperCase()
      this.push(upperStr)
      cb()
    }))
    .pipe(process.stdout)
}

const convertToFile = (fileName) => {
  const extName = path.extname(fileName)
  if (extName.toLowerCase() !== csvExtension) return
  const baseName = path.basename(fileName, extName)
  const writer = fs.createWriteStream(`${path.dirname(fileName)}/${baseName}.json`)

  writer.on("end", () => console.log(`${baseName}.json was created`))
  
  fs.createReadStream(fileName)
    .pipe(through2(function (chunk, enc, cb) {
      const str = chunk.toString()
      const json = csvToJSON(str)
      this.push(json)
      cb()
    }))
    .pipe(writer)
}

const csvExtension = '.csv'
const outputFile = (fileName) => {
  if(path.extname(fileName).toLowerCase() !== csvExtension) return
  fs.createReadStream(fileName)
    .pipe(through2(function (chunk, enc, cb) {
      const str = chunk.toString()
      const json = csvToJSON(str)
      this.push(json)
      cb()
    }))
    .pipe(process.stdout)
}

const readdir = promisify(fs.readdir);
const httpGet = promisify(http.get);
const cssBundler = (dirname) => {
  const writer = fs.createWriteStream(`${dirname}/bundle.css`);
  readdir(dirname)
    .then((files) => {
      files.map((file) => {
        fs.createReadStream(`${dirname}/${file}`)
          .pipe(through2(function(chunk, enc, cb) {
            const css = chunk.toString()  "\n";
            this.push(css);
            cb();
          }))
          .pipe(fs.createWriteStream(`${dirname}/bundle.css`));
      });
    })
    .catch(err => console.log(2));
}

const args = minimist(process.argv.slice(2), config.streamsMinimistOpts)
const argsKeys = Object.keys(args)
argsKeys.forEach((arg, i) => {
  if (i === 1 && (arg === 'h' || arg === 'help')) {
    console.info(helpText)
  }
})

if (!argsKeys.length) {
  console.info('No args found. Default h flag')
  console.info(helpText)
}

if(args.a && args.p) {
  cssBundler(args.p);
}
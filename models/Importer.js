import fs from 'fs'
import { csvToJSON } from '../utils'

export default class Importer {
  constructor(emitter) {
    emitter.on('changed', (path, async) => {
      if(async) {
        this.import(path)
          .then(data => console.log(csvToJSON(data.toString())))
          .catch(err => console.log(err))
      } else {
        console.log(csvToJSON(this.importSync(path).toString()))
      }      
    })
  }

  import(path) {
    return new Promise((res, rej) => (
      fs.readFile(path,(err, data) => {
        if(err) return rej(err)
        return res(data)
      })
    ))
  }
  
  importSync(path) {
    console.log(path)
    return fs.readFileSync(path)
  }
}
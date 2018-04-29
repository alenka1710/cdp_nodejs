import fs from 'fs'

export default class DirWatcher {
  constructor(emitter) {
    this.emitter = emitter
    this.filesMtime = {}
  }
  watch(path, delay) {
    setInterval(() => {
      fs.readdir(path, function(error, files) {
        if(error) return error
        files.forEach(file => {
          const fileStat = fs.statSync(`${path}\\${file}`)
          if(this.filesMtime[file] !== fileStat.mtime) {
            this.filesMtime[file] = fileStat.mtime
            this.emmiter.emit('changed', file, true)
          }
        })
        console.log(this.filesMtime)
      }.bind(this))
    }, delay)
  }
}

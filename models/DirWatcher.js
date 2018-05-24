import fs from 'fs'

export default class DirWatcher {
  constructor(emitter) {
    this.emitter = emitter
    this.filesMtime = {}
  }
  watch(path, delay) {
    setInterval(() => {
      fs.readdir(path, (error, files) => {
        if(error) return error
        files.forEach(file => {
          const fileStat = fs.statSync(`${path}\\${file}`)
          if(this.filesMtime[file] !== fileStat.mtime) {
            this.filesMtime[file] = fileStat.mtime
            this.emitter.emit('changed', file, true)
          }
        })
      })
    }, delay)
  }
}

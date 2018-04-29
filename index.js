import 'babel-register'
import EventEmitter from 'events'
import { User, Product, DirWatcher, Importer } from './models'
import config from './config'

console.log(config.name)

const user = new User()
const product = new Product()
const emitter = new EventEmitter()
const dirWatcher = new DirWatcher(emitter)
const importer = new Importer(emitter)

dirWatcher.watch(__dirname + '\\data', 1000)

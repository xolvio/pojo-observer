import FileTree from './domain/FileTree'
import FileContents from './domain/FileContents'
import FileDetails from './domain/FileDetails'
import MemoryFileRepository from "./domain/MemoryFileRepository"
import SimpleEventEmitter from "./domain/SimpleEventEmitter"
import SpecService from './domain/SpecService'

const memoryFileRepository = new MemoryFileRepository()

const simpleEventEmitter = new SimpleEventEmitter()

const fileTree = new FileTree(simpleEventEmitter, memoryFileRepository)
export interface IFileTree { fileTree: FileTree }

const fileContents = new FileContents()
export interface IFileContents { fileContents: FileContents }

const fileDetails = new FileDetails()
export interface IFileDetails { fileDetails: FileDetails }

const specService = new SpecService(simpleEventEmitter, fileTree, fileContents, fileDetails)

export default {
  fileTree,
  fileContents,
  fileDetails,
  specService
}

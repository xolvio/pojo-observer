import {FileTree} from './domain/FileTree'
import {FileContent} from './domain/FileContent'
import {FileDetails} from './domain/FileDetails'
import {SimpleEventEmitter} from "./domain/SimpleEventEmitter"
import {WorkspaceService} from './domain/WorkspaceService'
import {MemoryFileRepository} from "./domain/MemoryFileRepository"

const memoryFileRepository = new MemoryFileRepository()

const simpleEventEmitter = new SimpleEventEmitter()

const fileTree = new FileTree(simpleEventEmitter, memoryFileRepository)
export interface IFileTree { fileTree: FileTree }

const fileContent = new FileContent()
export interface IFileContent { fileContent: FileContent }

const fileDetails = new FileDetails()
export interface IFileDetails { fileDetails: FileDetails }

const workspaceService = new WorkspaceService(simpleEventEmitter, fileTree, fileContent, fileDetails)

export default {
  fileTree,
  fileContent,
  fileDetails,
  workspaceService
}

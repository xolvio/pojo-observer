import IFileRepository from "./IFileRepository"
import IEventEmitter from "./IEventEmitter"
import FileTree from "./FileTree"
import FileContents from "./FileContents"
import FileDetails from "./FileDetails"
import IDomainEvent from "./IDomainEvent"

export default class SpecService {
  _fileRepository: IFileRepository
  _eventEmitter: IEventEmitter
  _fileTree: FileTree
  _fileContents: FileContents
  _fileDetails: FileDetails

  constructor(
    fileRepository: IFileRepository,
    eventEmitter: IEventEmitter,
    fileTree: FileTree,
    fileContents: FileContents,
    fileDetails: FileDetails) {
    this._fileRepository = fileRepository
    this._eventEmitter = eventEmitter
    this._fileTree = fileTree
    this._fileContents = fileContents
    this._fileDetails = fileDetails
  }

  init() {
    this._fileTree.files = this._fileRepository.getFiles()
    this._eventEmitter.on('FileSelectedEvent', (event: IDomainEvent) => {
      // @ts-ignore
      this._fileContents.setFile(event._file)
      // @ts-ignore
      this._fileDetails.setFile(event._file)
    })
  }
}

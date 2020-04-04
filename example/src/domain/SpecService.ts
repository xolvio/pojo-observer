import IFileRepository from "./IFileRepository"
import IEventEmitter from "./IEventEmitter"
import FileTree from "./FileTree"
import FileContents from "./FileContents"
import FileDetails from "./FileDetails"
import FileSelectedEvent from "./FileSelectedEvent"
import FileUnselectedEvent from "./FileUnselectedEvent"

export default class SpecService {

  constructor(
    private fileRepository: IFileRepository,
    private eventEmitter: IEventEmitter,
    private fileTree: FileTree,
    private fileContents: FileContents,
    private fileDetails: FileDetails) {}

  init() {
    // we can add onNewFiles
    this.fileTree.files = this.fileRepository.getFiles()
    this.eventEmitter.on(FileSelectedEvent, (event) => {
      console.log('selected')
      this.fileContents.setFile(event._file)
      this.fileDetails.setFile(event._file)
    })

    this.eventEmitter.on(FileUnselectedEvent, (event) => {
      console.log('unselected')
    })
  }
}

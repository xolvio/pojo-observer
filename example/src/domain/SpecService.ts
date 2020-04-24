import {IEventEmitter} from "./IEventEmitter"
import {FileTree} from "./FileTree"
import {FileContents} from "./FileContents"
import {FileDetails} from "./FileDetails"
import {FileSelectedEvent} from "./FileSelectedEvent"
import {FileUnselectedEvent} from "./FileUnselectedEvent"

export class SpecService {

  constructor(
    private eventEmitter: IEventEmitter,
    private fileTree: FileTree,
    private fileContents: FileContents,
    private fileDetails: FileDetails) {}

  init() {
    this.eventEmitter.on(FileSelectedEvent, (event) => {
      this.fileContents.setFile(event._file)
      this.fileDetails.setFile(event._file)
    })

    this.eventEmitter.on(FileUnselectedEvent, (event) => {
      console.log('unselected')
    })
  }
}

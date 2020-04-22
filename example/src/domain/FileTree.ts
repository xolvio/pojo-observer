import {File} from "./File"
import {IEventEmitter} from "./IEventEmitter"
import FileSelectedEvent from "./FileSelectedEvent"

export class FileTree {
  private _files: File[]
  private _selections = new Set()

  constructor(private _eventEmitter: IEventEmitter) {
  }

  select(file: any) {
    this._selections.add(file)
    this._eventEmitter.emit(new FileSelectedEvent(file))
  }

  get files() {
    return this._files
  }

  load(files: File[]) {
    this._files = files
  }
}

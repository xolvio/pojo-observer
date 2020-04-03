import File from './File'
import FileSelectedEvent from './FileSelectedEvent'
import FileUnselectedEvent from './FileUnselectedEvent'
import IEventEmitter from "./IEventEmitter"

export default class FileTree {
  _eventEmitter: IEventEmitter
  constructor(eventEmitter: IEventEmitter) {
    this._eventEmitter = eventEmitter
  }

  _files?:File[]

  get files () {
    return this._files || []
  }

  set files(files: File[]) {
    this._files = files
  }

  toggleSelected(file: File) {
    // FIXME the pojo-observer is not working for this case
    file.selected = !file.selected
    if (file.selected) {
      this._eventEmitter.emit(new FileSelectedEvent(file))
    } else {
      this._eventEmitter.emit(new FileUnselectedEvent(file))
    }
  }
}

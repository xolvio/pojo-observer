import {File} from './File'
import {FileSelectedEvent} from './FileSelectedEvent'
import {FileUnselectedEvent} from './FileUnselectedEvent'
import {IEventEmitter} from "./IEventEmitter"
import {IFileRepository} from "./IFileRepository"

export class FileTree {
  constructor(
    private _eventEmitter: IEventEmitter,
    private _fileRepository: IFileRepository
  ) {}

  _files:File[] = []
  _loading: boolean = false
  _locked: boolean = false

  loadFiles(cb?: Function) {
    this._loading = true
    this._fileRepository.getFiles().then((files)=> {
      this._loading = false
      files.forEach((file) => {
        this._files.push(file)
      })
      if (cb) cb()
    })
  }

  writeFiles() {
    this._locked = true
    this._fileRepository.writeFiles().then(() => {
      this._locked = false;
    })
  }

  get files () {
    return this._files
  }

  get loading() {
    return this._loading
  }

  get locked() {
    return this._locked
  }

  toggleSelected(file: File) {
    file.selected = !file.selected

    this.files.forEach((f) => {
      if (f !== file) {
        f.selected = false
      }
    })

    if (file.selected) {
      this._eventEmitter.emit(new FileSelectedEvent(file))
    } else {
      this._eventEmitter.emit(new FileUnselectedEvent(file))
    }
  }
}

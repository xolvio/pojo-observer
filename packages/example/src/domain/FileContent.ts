import {File} from "./File"

export class FileContent {
  private _file: File

  set file(file: File) {
    this._file = file
  }

  get content() {
    return this._file.content
  }
}

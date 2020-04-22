import {File} from "./File"

export class FileDetails {
  private _file: File

  set file(file: File) {
    this._file = file
  }

  get createdAt() {
    return this._file.createdAt
  }
}

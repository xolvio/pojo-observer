import {File} from './File'

export class FileDetails {
  file?: File

  setFile(file: File) {
    this.file = file
  }

  get name() {
    return this.file ? this.file.name : ''
  }

  get path() {
    return this.file ? this.file.path : ''
  }
}

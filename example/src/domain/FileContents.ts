import {File} from './File'

export class FileContents {
  file?: File

  setFile(file: File) {
    this.file = file
  }

  get name() {
    return this.file ? this.file.name : ''
  }

  get content() {
    return this.file ? this.file.content : ''
  }
}

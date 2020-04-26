import {File} from "./File"
import {IDomainEvent} from "./IDomainEvent"

export class FileSelectedEvent  implements IDomainEvent {
  _file: File
  _dateTimeOccurred: Date
  constructor(file: File) {
    this._dateTimeOccurred = new Date()
    this._file = file
  }

  get file() {
    return this._file
  }
}



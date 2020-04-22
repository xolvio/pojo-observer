import {IDomainEvent} from "./IDomainEvent"
import {File} from "./File"

export default class FileSelectedEvent implements IDomainEvent {
  _dateTimeOccurred: Date

  constructor(private _file: File) {
    this._dateTimeOccurred = new Date()
  }

  get file() {
    return this._file
  }
}

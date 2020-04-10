export class File {
  constructor(
    private _filename: string,
    private _content: string,
    private _createdAt: Date
  ) {
  }

  get filename() {
    return this._filename
  }

  get content() {
    return this._content
  }

  get createdAt() {
    return this._createdAt
  }
}

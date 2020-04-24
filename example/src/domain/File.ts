export class File {
  name: string
  path: string
  content: string
  selected: boolean
  constructor(name: string,  content: string, path: string) {
    this.name = name
    this.path = path
    this.content = content
    this.selected = false
  }
  get canonicalPath () {
    return this.path + this.name
  }
}

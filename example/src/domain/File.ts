export default class File {
  name: string
  path: string
  content: string
  selected: boolean
  constructor(name: string, path: string, content: string) {
    this.name = name
    this.path = path
    this.content = content
    this.selected = false
  }
  get canonicalPath () {
    return this.path + '/' + this.name
  }
}

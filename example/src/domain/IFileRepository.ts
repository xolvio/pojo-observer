import File from './File'

export default interface IFileRepository {
  getFiles(): Promise<File[]>
  writeFiles(): Promise<void>
}

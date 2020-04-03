import File from './File'

export default interface IFileRepository {
  getFiles(): File[]
}

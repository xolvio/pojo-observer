import {File} from './File'

export interface IFileRepository {
  getFiles(): Promise<File[]>
  writeFiles(): Promise<void>
}

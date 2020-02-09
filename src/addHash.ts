import {WithHash} from './withHash'
import hash from './hash'

export function addHash<T>(testClass: T): T & WithHash {
  testClass['hash'] = function() {
    return hash(this)
  }
  return testClass as T & WithHash
}

import hash from './hash'

export function addHash<T>(testClass: T): T {
  testClass['hash'] = function() {
    return hash(this)
  }
  return testClass
}

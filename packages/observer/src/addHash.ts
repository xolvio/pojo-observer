import hash from './hash'

export function addHash<T>(testClass: T): T {
  // eslint-disable-next-line no-param-reassign
  testClass.hash = function () {
    return hash(this)
  }
  return testClass
}

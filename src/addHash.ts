/* eslint-disable no-param-reassign */
import hash from './hash'

export function addHash<T>(testClass: T): T {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  testClass.hash = function () {
    return hash(this)
  }
  return testClass
}

/* eslint-disable @typescript-eslint/no-empty-function */
import {command, hashable, query} from '../lib'

@hashable
class TestClass {
  @command doSomething() {}

  @command doSomethingElse() {}

  @query showSomething() {}

  @query showSomethingElse() {}

  _aPrivateMethod() {}

  aPublicMethod() {}
}

const testClassInstance = new TestClass()

describe('decorators', () => {
  describe('@hashable', () => {
    it('should provide a hash method on instances of classes that have the @hashable decorator', function() {
      expect(typeof testClassInstance.hash()).toEqual('string')
    })
  })
  describe('@command', () => {
    it('should add a command attribute to methods that have been annotated with the @command decorator', () => {
      expect(testClassInstance.doSomething.command).toEqual(true)
      expect(testClassInstance.doSomethingElse.command).toEqual(true)
    })
    it('should not add any command attributes to methods that have not had the @command decorator', function() {
      expect(testClassInstance._aPrivateMethod.command).toEqual(undefined)
      expect(testClassInstance.aPublicMethod.command).toEqual(undefined)
    })
  })
  describe('@query', () => {
    it('should add a query attribute to methods that have been annotated with the @query decorator', () => {
      expect(testClassInstance.showSomething.query).toEqual(true)
      expect(testClassInstance.showSomethingElse.query).toEqual(true)
    })
    it('should not add any query attributes to methods that have not had the @query decorator', function() {
      expect(testClassInstance._aPrivateMethod.query).toEqual(undefined)
      expect(testClassInstance.aPublicMethod.query).toEqual(undefined)
    })
  })
})

import {command, hashable, query} from '../lib'

@hashable
class TestClass {
  @command doSomething() {
  }

  @command doSomethingElse() {
  }

  @query showSomething() {
  }

  @query showSomethingElse() {
  }

  _aPrivateMethod() {
  }

  aPublicMethod() {
  }
}

const testClassInstance = new TestClass()

describe('decorators', () => {
  describe('commands', () => {
    it('should provide a hash method on the class instance', function () {
      expect(typeof testClassInstance.hash()).toEqual('string')
    })
    it('should add a command attribute to methods that have been annotated with the @command decorator', () => {
      expect(testClassInstance.doSomething.command).toEqual(true)
      expect(testClassInstance.doSomethingElse.command).toEqual(true)
    })
    it('should add a query attribute to methods that have been annotated with the @query decorator', () => {
      expect(testClassInstance.showSomething.query).toEqual(true)
      expect(testClassInstance.showSomethingElse.query).toEqual(true)
    })
    it('should not add any command or query attributes to methods that have not had the @command or @query decorators', function () {
      expect(testClassInstance._aPrivateMethod.command).toEqual(undefined)
      expect(testClassInstance._aPrivateMethod.query).toEqual(undefined)
      expect(testClassInstance.aPublicMethod.command).toEqual(undefined)
      expect(testClassInstance.aPublicMethod.query).toEqual(undefined)
    })
  })
})

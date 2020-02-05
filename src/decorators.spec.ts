/* eslint-disable @typescript-eslint/no-empty-function */
import {command, hashable, query, live} from './decorators'
import {isTSUndefinedKeyword} from '@babel/types'

@hashable
class TestClass {
  @live _liveAttribute = 'foo'

  _plainAttribute = 'bar'

  @command doSomething() {}

  @command doSomethingElse() {}

  @command doSomethingFatArrow = () => ''

  @command set aSetter(val) {}

  @query showSomething() {}

  @query showSomethingElse() {}

  @query showSomethingFatArrow = () => ''

  aMethod() {}

  aMethodFatArrow = () => ''
}

let testClassInstance

describe.only('decorators', () => {
  beforeEach(() => {
    testClassInstance = new TestClass()
  })
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
      expect(testClassInstance.aMethod.command).toEqual(undefined)
      expect(testClassInstance.aMethodFatArrow.command).toEqual(undefined)
    })
    it('should add a command attribute to anonymous methods that have been annotated with the @command decorator', () => {
      expect(testClassInstance.doSomethingFatArrow.command).toEqual(true)
    })
    it('should add a callback on setters that have been annotated with the @command decorator', () => {
      let callbackCalled = false
      testClassInstance['__set__aSetter'] = () => (callbackCalled = true)
      testClassInstance.aSetter = 'something'
      expect(callbackCalled).toEqual(true)
    })
    it('should add a command attribute to the callback on setters that have been annotated with the @command decorator', () => {
      expect(testClassInstance['__set__aSetter'].command).toEqual(true)
    })
  })
  describe('@query', () => {
    it('should add a query attribute to methods that have been annotated with the @query decorator', () => {
      expect(testClassInstance.showSomething.query).toEqual(true)
      expect(testClassInstance.showSomethingElse.query).toEqual(true)
    })
    it('should not add any query attributes to methods that have not had the @query decorator', function() {
      expect(testClassInstance.aMethod.query).toEqual(undefined)
      expect(testClassInstance.aMethodFatArrow.query).toEqual(undefined)
    })
    it('should add a query attribute to anonymous methods that have been annotated with the @query decorator', () => {
      expect(testClassInstance.showSomethingFatArrow.query).toEqual(true)
    })
  })
  describe('@live', () => {
    it('should set the initial value on attributes decorated with @live', () => {
      expect(testClassInstance._liveAttribute).toEqual('foo')
    })
    it('should make the setter and getter enumerable for attributes decorated with @live', () => {
      const parentPrototype = Object.getPrototypeOf(
        Object.getPrototypeOf(testClassInstance)
      )
      const parentPrototypeProperties = Object.getOwnPropertyNames(
        parentPrototype
      )
      expect(parentPrototypeProperties.indexOf('__set___liveAttribute') !== -1)
    })
    it('should create a getter for attributes decorated with @live', () => {
      const parentPrototype = Object.getPrototypeOf(
        Object.getPrototypeOf(testClassInstance)
      )
      expect(
        Object.getOwnPropertyDescriptor(parentPrototype, '_liveAttribute').get
      ).toBeDefined()
    })
    it('should create a setter for attributes decorated with @live', () => {
      const parentPrototype = Object.getPrototypeOf(
        Object.getPrototypeOf(testClassInstance)
      )
      expect(
        Object.getOwnPropertyDescriptor(parentPrototype, '_liveAttribute').set
      ).toBeDefined()
    })
    it('should not create a getter or a setter for attributes not decorated with @live', () => {
      const parentPrototype = Object.getPrototypeOf(
        Object.getPrototypeOf(testClassInstance)
      )
      expect(
        Object.getOwnPropertyDescriptor(parentPrototype, '_plainAttribute')
      ).not.toBeDefined()
    })
    it('should add a callback on setters that have been annotated with the @live decorator', () => {
      let callbackCalled = false
      testClassInstance['__set___liveAttribute'] = () => (callbackCalled = true)
      testClassInstance._liveAttribute = 'something'
      expect(callbackCalled).toEqual(true)
    })
    it('should add a command attribute to the callback on setters that have been annotated with the @live decorator', () => {
      expect(testClassInstance['__set___liveAttribute'].command).toEqual(true)
    })
  })
})

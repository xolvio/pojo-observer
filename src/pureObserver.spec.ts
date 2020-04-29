/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as td from 'testdouble'
import {pureObserver} from './useObserver'

test('it reacts to a change', () => {
  const object = {test: 'abc'}
  const obj1Callback = td.func() as () => void
  pureObserver(object, obj1Callback)
  td.verify(obj1Callback(), {times: 0})

  object.test = 'def'
  expect(object.test).toEqual('def')
  td.verify(obj1Callback(), {times: 1})
  object.test = 'there'
  expect(object.test).toEqual('there')
  td.verify(obj1Callback(), {times: 2})
})

test('that it can work with multiple objects, no react', () => {
  const obj1 = {
    foo: 'here',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    mutateMe: () => {
      obj1.foo = 'there'
    },
  }
  const obj2 = {
    bar: 'pete',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    mutateMe: () => {
      obj2.bar = 'paul'
    },
  }
  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)
  const obj2Callback = td.func()
  pureObserver(obj2, obj2Callback)
  td.verify(obj1Callback(), {times: 0})
  td.verify(obj2Callback(), {times: 0})

  obj1.mutateMe()
  td.verify(obj1Callback())
  td.verify(obj2Callback(), {times: 0})
  obj2.mutateMe()
  td.verify(obj2Callback())
})

test('it should callback for changes in objects added to arrays', () => {
  const object = {arr: []}
  const obj1Callback = td.func()
  pureObserver(object, obj1Callback)
  // FIXME - get rid of the initial callback

  td.verify(obj1Callback(), {times: 0})

  object.arr[0] = {
    hello: 'world',
  }
  td.verify(obj1Callback(), {times: 1})

  object.arr[0].hello = 'there'

  td.verify(obj1Callback(), {times: 2})
})

test('it should callback for changes in objects added to arrays before observer is attached', () => {
  const object = {arr: []}
  const obj1Callback = td.func()
  object.arr[0] = {
    hello: 'world',
  }
  pureObserver(object, obj1Callback)
  // FIXME - callback should not happen right after observing

  td.verify(obj1Callback(), {times: 0})

  object.arr[0].hello = 'there'

  td.verify(obj1Callback(), {times: 2})
})

test('it should callback for changes in objects added to arrays before observer is attached', () => {
  const object = {arr: []}
  const obj1Callback = td.func()
  object.arr[0] = {
    hello: 'world',
  }
  object.arr[1] = {
    yo: 'dude',
  }
  pureObserver(object, obj1Callback)

  object.arr[1].yo = 'man'

  td.verify(obj1Callback())
})

test('changing the value of an inner object', () => {
  const obj1 = {innerObj: {}}
  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)
  td.verify(obj1Callback(), {times: 0})

  // @ts-ignore
  obj1.innerObj.test = 's'
  td.verify(obj1Callback(), {times: 1})
})

test('undefined array', () => {
  const obj1 = {files: undefined}
  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)

  td.verify(obj1Callback(), {times: 0})
  obj1.files = ['sdg']
  td.verify(obj1Callback(), {times: 1})
})

test('it should observe provided objects that overwrite internal objects', () => {
  const innerObj = {foo: 'something'}
  // eslint-disable-next-line no-empty-pattern
  const obj1 = {innerObj: {} = {}}
  const obj1Callback = td.func()
  obj1.innerObj = innerObj
  pureObserver(obj1, obj1Callback)
  td.verify(obj1Callback(), {times: 0})

  innerObj.foo = 'bar'

  td.verify(obj1Callback())
})

test('it should observe provided objects that create new internal objects', () => {
  const innerObj = {foo: 'test'}
  const obj1 = {}
  const obj1Callback = td.func()
  // @ts-ignore
  obj1.innerObj = innerObj
  pureObserver(obj1, obj1Callback)
  td.verify(obj1Callback(), {times: 0})

  innerObj.foo = 'bar'

  td.verify(obj1Callback(), {times: 1})
})

test('multi-level depth fields are set to an object whose value changes', () => {
  const object = {field: {nested: {}}}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)

  td.verify(objectCallback(), {times: 0})

  object.field.nested = {
    deep: {
      very: 'deeper',
    },
  }

  td.verify(objectCallback(), {times: 2})
})

test('multi-level depth fields are set to an object whose value changes', () => {
  const object = {field: {}}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  object.field = {
    nested: {},
  }
  td.verify(objectCallback(), {times: 1})
})

test('multi-level depth fields are set to an object whose value changes', () => {
  const object = {field: {}}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  object.field = {
    nested: {},
  }
  td.verify(objectCallback(), {times: 1})

  // @ts-ignore
  object.field.nested = {
    deep: {
      very: 'deeper',
    },
  }

  // @ts-ignore
  expect(object.field.nested.deep.very).toEqual('deeper')
  td.verify(objectCallback(), {times: 3})
})

test('multi-level depth fields are set to an object whose value changes', () => {
  const object = {field: null}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  object.field = {
    nested: {},
  }
  td.verify(objectCallback(), {times: 1})

  object.field.nested.deep = {very: 'deeper'}

  td.verify(objectCallback(), {times: 2})

  object.field.nested.deep.very = 'changed string'

  td.verify(objectCallback(), {times: 3})
})

test('multi-level depth fields are set to an object whose value changes - no proxy', () => {
  const object = {field: {nested: {deep: 'old'}}}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  object.field = {
    nested: {
      deep: 'value',
    },
  }

  td.verify(objectCallback(), {times: 1})

  expect(object.field.nested.deep).toEqual('value')
  // object.field.nested = {
  //   deep: {
  //     very: 'deeper',
  //   },
  // }
  // td.verify(objectCallback(), {times: 2})
  //
  // expect(object.field.nested.deep.very).toEqual('deeper')
})

test('multi-level depth fields are set to an object whose value changes', () => {
  const object = {field: null}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  object.field = {
    nested: {
      deep: 'value',
    },
  }

  td.verify(objectCallback(), {times: 1})

  expect(object.field.nested.deep).toEqual('value')
  object.field = {
    nested: {
      deep: 'newValue',
    },
  }
  td.verify(objectCallback(), {times: 2})

  expect(object.field.nested.deep).toEqual('newValue')
})

test('multi-level depth fields are set to an object whose value changes', () => {
  const object = {field: null}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  object.field = {
    nested: {
      deep: 'value',
    },
  }

  td.verify(objectCallback(), {times: 1})

  expect(object.field.nested.deep).toEqual('value')

  object.field.nested.deep = 'newValue'
  td.verify(objectCallback(), {times: 3})

  expect(object.field.nested.deep).toEqual('newValue')
})

test('multi-level depth fields are set to an object whose value changes - no proxy', () => {
  const object = {field: {nested: {deep: ''}}}

  const objectCallback = td.func()
  pureObserver(object, objectCallback)
  td.verify(objectCallback(), {times: 0})
  //
  // object.field = {
  //   nested: {
  //     deep: 'value',
  //   },
  // }

  object.field.nested.deep = 'value'
  td.verify(objectCallback(), {times: 2})

  expect(object.field.nested.deep).toEqual('value')
})

test('Setting null to an already null value should not trigger a callback', () => {
  const obj = {
    nullValue: null,
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  obj.nullValue = null

  td.verify(objectCallback(), {times: 0})
})

test('Setting null to an already null value, then setting a real value should trigger a callback', () => {
  const obj = {
    nullValue: null,
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)
  td.verify(objectCallback(), {times: 0})

  obj.nullValue = null
  expect(obj.nullValue).toEqual(null)
  td.verify(objectCallback(), {times: 0})

  obj.nullValue = 'something'
  expect(obj.nullValue).toEqual('something')

  td.verify(objectCallback(), {times: 1})
})

test('Setting null to an assigned property should trigger a callback', () => {
  const obj = {
    nullValue: 'anything',
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  td.verify(objectCallback(), {times: 0})

  obj.nullValue = null
  expect(obj.nullValue).toEqual(null)

  td.verify(objectCallback(), {times: 1})
})

test('Setting null to an assigned property, then setting a real value should trigger a callback', () => {
  const obj = {
    nullValue: 'anything',
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  td.verify(objectCallback(), {times: 0})

  obj.nullValue = null
  expect(obj.nullValue).toEqual(null)

  td.verify(objectCallback(), {times: 1})

  obj.nullValue = 'something'
  expect(obj.nullValue).toEqual('something')

  td.verify(objectCallback(), {times: 2})
})

test('Arrays pop', () => {
  const obj = {
    arr: ['a'],
  }
  const obj1Callback = td.func()
  pureObserver(obj, obj1Callback)

  const p = obj.arr.pop()
  expect(p).toEqual('a')

  expect(obj.arr).toHaveLength(0)

  td.verify(obj1Callback(), {times: 1})
})

test('Arrays splice', () => {
  const obj = {
    arr: [],
  }
  const obj1Callback = td.func()
  pureObserver(obj, obj1Callback)

  obj.arr[0] = 'a'
  obj.arr[1] = 'b'
  obj.arr[2] = 'c'
  obj.arr[3] = 'd'

  obj.arr.splice(2, 2)
  expect(obj.arr).toHaveLength(2)
  expect(obj.arr[0]).toEqual('a')
  expect(obj.arr[1]).toEqual('b')

  td.verify(obj1Callback(), {times: 5})
})

test('it should observe provided arrays that overwrite internal arrays', () => {
  const arr = []
  const obj1 = {arr: []}
  const obj1Callback = td.func()
  obj1.arr = arr
  pureObserver(obj1, obj1Callback)

  // requires no callback on 185
  td.verify(obj1Callback(), {times: 0})

  obj1.arr.push('boo')
  expect(obj1.arr[0]).toEqual('boo')
  expect(obj1.arr).toHaveLength(1)

  // requires callback on 185
  td.verify(obj1Callback(), {times: 1})
})

test('overwrite array with something else', () => {
  const obj1 = {innerObj: {}, arr: []}
  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)

  td.verify(obj1Callback(), {times: 0})

  obj1.arr = ['sdg']
  expect(obj1.arr[0]).toEqual('sdg')
  expect(obj1.arr).toHaveLength(1)

  td.verify(obj1Callback(), {times: 1})
})

test('changing the assignment from array to a different array', () => {
  const obj1 = {arr: []}
  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)
  // requires no callback on 185
  td.verify(obj1Callback(), {times: 0})

  obj1.arr = ['sdg']
  expect(obj1.arr[0]).toEqual('sdg')
  expect(obj1.arr).toHaveLength(1)

  td.verify(obj1Callback(), {times: 1})
})

test('it should observe provided external arrays', () => {
  const arr = []
  const obj1 = {arr}

  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)

  // requires no callback on 185
  td.verify(obj1Callback(), {times: 0})

  obj1.arr.push('boo')
  expect(obj1.arr[0]).toEqual('boo')
  expect(obj1.arr).toHaveLength(1)

  // requires callback on 185
  td.verify(obj1Callback(), {times: 1})
})

test('it should observe provided internal arrays', () => {
  const obj1 = {arr: []}

  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)

  // requires no callback on 185
  td.verify(obj1Callback(), {times: 0})

  obj1.arr.push('boo')
  // requires callback on 185
  td.verify(obj1Callback(), {times: 1})
})

// - - OUTSTANDING BUGS - -

test.skip('obj with a prop that is an object, set prop to null, then set prop to a string. should trigger 2 callbacks', () => {
  const obj = {
    prop: {},
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  obj.prop = null
  expect(obj.prop).toBeNull()
  obj.prop = 'asd'
  expect(obj.prop).toEqual('asd')

  td.verify(objectCallback(), {times: 2})
})

test.skip('obj with a prop that is an object, set prop to null, then set prop to an array. should trigger 2 callbacks', () => {
  const obj = {
    prop: {},
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  obj.prop = null
  expect(obj.prop).toBeNull()
  obj.prop = []
  expect(obj.prop).toEqual([])

  td.verify(objectCallback(), {times: 2})
})

test.skip('obj with a prop that is an object, set prop to null, then set prop to a object. should trigger 2 callbacks', () => {
  const obj = {
    prop: {},
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  obj.prop = null
  expect(obj.prop).toBeNull()
  obj.prop = {}
  expect(obj.prop).toEqual({})

  td.verify(objectCallback(), {times: 2})
})

test.skip('Setting null to an existing property and observe, then setting a real value should trigger a callback', () => {
  const obj = {
    prop: {},
  }
  const objectCallback = td.func()
  pureObserver(obj, objectCallback)

  td.verify(objectCallback(), {times: 0})

  obj.prop = null
  expect(obj.prop).toBeNull()

  td.verify(objectCallback(), {times: 1})
})

// - - UNSUPPORTED - -

test.skip('THIS WILL NEVER WORK - UNSUPPORTED AS ARRAY IS CHANGED OUTSIDE OF OBSERVED OBJECT', () => {
  const arr = []
  const obj1 = {arr: []}
  const obj1Callback = td.func()
  obj1.arr = arr
  pureObserver(obj1, obj1Callback)

  td.verify(obj1Callback(), {times: 0})

  arr.push('boo')

  td.verify(obj1Callback(), {times: 1})
})

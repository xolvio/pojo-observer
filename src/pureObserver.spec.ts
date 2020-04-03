import * as td from 'testdouble'
import {pureObserver} from './useObserver'

test('it reacts to a change', () => {
  const object = {test: 'abc'}
  const obj1Callback = td.func() as () => void
  pureObserver(object, obj1Callback)

  object.test = 'def'
  td.verify(obj1Callback())
  object.test = 'there'
  td.verify(obj1Callback(), {times: 2})
})

test('that it can work with multiple objects, no react', () => {
  const obj1 = {
    foo: 'here',
    mutateMe: () => (obj1.foo = 'there')
  }
  const obj2 = {
    bar: 'pete',
    mutateMe: () => (obj2.bar = 'paul')
  }
  const obj1Callback = td.func()
  pureObserver(obj1, obj1Callback)
  const obj2Callback = td.func()
  pureObserver(obj2, obj2Callback)

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
  object.arr[0] = {
    hello: 'world'
  }
  td.verify(obj1Callback())

  object.arr[0].hello = 'there'

  td.verify(obj1Callback(), {times: 2})
})

test('it should callback for changes in objects added to arrays before observer is attached', () => {
  const object = {arr: []}
  const obj1Callback = td.func()
  object.arr[0] = {
    hello: 'world'
  }
  pureObserver(object, obj1Callback)

  object.arr[0].hello = 'there'

  td.verify(obj1Callback())
})


test('it should callback for changes in objects added to arrays before observer is attached', () => {
  const object = {arr: []}
  const obj1Callback = td.func()
  object.arr[0] = {
    hello: 'world'
  }
  object.arr[1] = {
    yo: 'dude'
  }
  pureObserver(object, obj1Callback)

  object.arr[1].yo = 'man'

  td.verify(obj1Callback())
})

import {useCallback, useEffect, useRef, useState} from 'react'
import hash from './hash'

class EventEmitter {
  callbacks = {}

  on(eventId, subscriptionId, cb) {
    this.callbacks[eventId] = this.callbacks[eventId] || []
    cb.subscriptionId = subscriptionId
    this.callbacks[eventId].push(cb)
  }

  remove(eventId, subscriptionId) {
    this.callbacks[eventId] = this.callbacks[eventId].filter(
      c => c.subscriptionId !== subscriptionId
    )
  }

  emit(eventId) {
    this.callbacks[eventId] && this.callbacks[eventId].forEach(cb => cb())
  }
}

const eventEmitter = new EventEmitter()

type Model = {
  constructor
  __observableId?: string
  __proxyAttached?: boolean
  hash?: () => string
}

const id = (): string =>
  'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    (
      (Math.floor(new Date().getTime() / 16) + Math.random() * 16) % 16 |
      (0 & 0x3) |
      0x8
    ).toString(16)
  )

function getFieldNames(toCheck) {
  let props = []
  let obj = toCheck

  do {
    props = props.concat(Object.getOwnPropertyNames(obj))
  } while ((obj = Object.getPrototypeOf(obj)))
  return props
    .sort()
    .filter((e, i, arr) => e != arr[i + 1] && typeof toCheck[e] !== 'function')
}

function isWritableField(object, fieldName) {
  const fieldDescriptor = Object.getOwnPropertyDescriptor(object, fieldName)
  return fieldDescriptor && fieldDescriptor.writable
}

function isWriteableObjectField(object, fieldName) {
  return (
    isWritableField(object, fieldName) &&
    typeof object[fieldName] === 'object' &&
    object[fieldName] !== null
  )
}

function isWriteablePrimitiveField(object, fieldName) {
  return (
    isWritableField(object, fieldName) &&
    (typeof object[fieldName] !== 'object' || object[fieldName] === null)
  )
}

function isWriteableArray(object, fieldName) {
  return isWritableField(object, fieldName) && Array.isArray(object[fieldName])
}

function attachProxyToProperties(model: Model, callback: Function, id?) {
  if (!model.__proxyAttached) {
    model.__proxyAttached = true
    getFieldNames(model).forEach(field => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      recursivelyAttachProxy(
        model[field],
        field,
        model,
        id ? id : model.__observableId,
        callback
      )
    })
  }
}

function attachProxyToField(object, fieldName, originalField, callback, id) {
  Object.defineProperty(object, fieldName, {
    configurable: true,
    enumerable: true,
    get: () => originalField,
    set: value => {
      if (typeof value === 'object') {
        attachProxyToProperties(value, callback, id)
      }
      originalField = value
      callback()
    }
  })
}

function attachProxyToArray(object, fieldName, callback, id) {
  object[fieldName] = new Proxy(object[fieldName], {
    get: function(target, property) {
      return target[property]
    },
    set: function(target, property, value) {
      if (property !== '__proto__' && property !== 'length') {
        if (typeof value === 'object') {
          attachProxyToProperties(value, callback, id)
        }
        target[property] = value
        callback()
      }
      return true
    }
  })
}

function recursivelyAttachProxy(
  originalField,
  fieldName,
  object,
  id,
  callback: Function
) {
  if (isWriteablePrimitiveField(object, fieldName))
    return attachProxyToField(object, fieldName, originalField, callback, id)
  if (isWriteableArray(object, fieldName))
    return attachProxyToArray(object, fieldName, callback, id)
  if (isWriteableObjectField(object, fieldName)) {
    attachProxyToField(object, fieldName, originalField, callback, id)
    getFieldNames(object[fieldName]).forEach(nestedFieldName =>
      recursivelyAttachProxy(
        object[fieldName][nestedFieldName],
        nestedFieldName,
        object[fieldName],
        id,
        callback
      )
    )
    return
  }
}

function addId(model: Model) {
  if (!model.__observableId)
    Object.defineProperty(model, '__observableId', {
      value: id(),
      writable: false
    })
}

function addHash(model: Model) {
  if (!model.hash) model.hash = () => hash(model)
}

let currentId = 0

export function useUniqueId() {
  const ref = useRef(0)
  if (ref.current === 0) {
    ref.current = ++currentId
  }
  return 'subscription_id' + ref.current
}

function reactify(model: Model) {
  const subscriptionId = useUniqueId()
  const [, stateChange] = useState(model.hash())

  const stateChangeCallback = useCallback(() => {
    stateChange(model.hash())
  }, [model.__observableId])

  useEffect(() => {
    eventEmitter.on(model.__observableId, subscriptionId, stateChangeCallback)
    return () => eventEmitter.remove(model.__observableId, subscriptionId)
  }, [model.__observableId, subscriptionId])
  return () => eventEmitter.emit(model.__observableId)
}

function decorate(model: Model) {
  addHash(model)
  addId(model)
}

function useObserver<T extends Model>(model: T): T {
  decorate(model)
  const callback = reactify(model)
  attachProxyToProperties(model, callback)
  return model
}

export function pureObserver<T extends Model>(model: T, callback: Function): T {
  decorate(model)
  attachProxyToProperties(model, callback)
  return model
}

export default useObserver

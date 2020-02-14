import {useCallback, useEffect, useState} from 'react'
import hash from './hash'

type Model = {
  constructor
  __observableId?: string
  __proxyAttached?: boolean
  hash?: () => string
}

const id = () =>
  'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.floor(new Date().getTime() / 16) + Math.random() * 16) % 16 | 0 & 0x3 | 0x8).toString(16))


function getFields(toCheck) {
  let props = []
  let obj = toCheck

  do {
    props = props.concat(Object.getOwnPropertyNames(obj))
  } while ((obj = Object.getPrototypeOf(obj)))
  return props.sort().filter((e, i, arr) => (e != arr[i + 1] && typeof toCheck[e] !== 'function'))
}

function attachProxyToField(object, fieldName, originalField, id) {
  Object.defineProperty(object, fieldName, {
    configurable: true,
    enumerable: true,
    get: () => originalField,
    set: (value) => {
      if (typeof value === 'object') {
        attachProxyToProperties(value, id)
      }
      originalField = value
      eventEmitter.emit(id)
    }
  })
}

function attachProxyToArray(object, fieldName, id) {
  object[fieldName] = new Proxy(object[fieldName], {
    get: function (target, property) {
      return target[property];
    },
    set: function (target, property, value) {

      if (property !== '__proto__' && property !== 'length') {
        target[property] = value;
        eventEmitter.emit(id)
      }
      return true;
    }
  })
}

function isWritableField(object, fieldName) {
  const fieldDescriptor = Object.getOwnPropertyDescriptor(object, fieldName)
  return fieldDescriptor && fieldDescriptor.writable
}

function isWriteableObjectField(object, fieldName) {
  return isWritableField(object, fieldName) && typeof object[fieldName] === 'object' && object[fieldName] !== null
}

function isWriteablePrimitiveField(object, fieldName) {
  return isWritableField(object, fieldName) && (typeof object[fieldName] !== 'object' || object[fieldName] === null)
}

function isWriteableArray(object, fieldName) {
  return isWritableField(object, fieldName) && Array.isArray(object[fieldName])
}

function recursivelyAttachProxy(originalField, fieldName, object, id) {
  if (isWriteablePrimitiveField(object, fieldName)) return attachProxyToField(object, fieldName, originalField, id)
  if (isWriteableArray(object, fieldName)) return attachProxyToArray(object, fieldName, id)
  if (isWriteableObjectField(object, fieldName)) {
    attachProxyToField(object, fieldName, originalField, id)
    getFields(object[fieldName]).forEach((nestedFieldName) =>
      recursivelyAttachProxy(object[fieldName][nestedFieldName], nestedFieldName, object[fieldName], id))
    return
  }
}

function attachProxyToProperties<T extends Model>(model: T, id?) {
  if (!model.__proxyAttached) {
    model.__proxyAttached = true
    getFields(model).forEach(field => {
      recursivelyAttachProxy(model[field], field, model, id ? id : model.__observableId)
    })
  }
}

function addId<T extends Model>(model: T) {
  if (!model.__observableId) Object.defineProperty(model, '__observableId', {value: id(), writable: false})
}

function addHash<T extends Model>(model: T) {
  if (!model.hash) model.hash = () => hash(model)
}

function reactify<T extends Model>(model: T) {
  const [, stateChange] = useState(model.hash())

  const stateChangeCallback = useCallback(() => {
    stateChange(model.hash())
  }, [model.__observableId])

  useEffect(() => {
    eventEmitter.on(model.__observableId, stateChangeCallback)
    return () => eventEmitter.remove(model.__observableId)
  }, [model.__observableId])
}

class EventEmitter {
  callbacks = {}

  on(eventId, cb) {
    this.callbacks[eventId] = this.callbacks[eventId] || []
    this.callbacks[eventId].push(cb)
  }

  remove(eventId) {
    delete this.callbacks[eventId]
  }

  emit(eventId) {
    this.callbacks[eventId] && this.callbacks[eventId].forEach(cb => cb())
  }
}

const eventEmitter = new EventEmitter()

function observe<T extends Model>(model: T): T {
  addHash(model)
  addId(model)
  attachProxyToProperties(model)
  reactify(model)
  return model
}

export default observe

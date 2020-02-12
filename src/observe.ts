import {useCallback, useEffect, useState} from 'react'
import hash from './hash'

type Model = {
  constructor
  __observableId?: string
  hash?: () => string
}

function id() {
  return 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.floor(new Date().getTime() / 16) + Math.random() * 16) % 16 | 0 & 0x3 | 0x8).toString(16))
}

function getFields(toCheck) {
  let props = []
  let obj = toCheck
  do {
    props = props.concat(Object.getOwnPropertyNames(obj))
  } while ((obj = Object.getPrototypeOf(obj)))
  return props.sort().filter((e, i, arr) => (e != arr[i + 1] && typeof toCheck[e] !== 'function'))
}

function attachProxy(object, fieldName, originalField, id) {
  Object.defineProperty(object, fieldName, {
    configurable: true,
    enumerable: true,
    get: () => originalField,
    set: (value) => {
      originalField = value
      eventEmitter.emit(id)
    }
  })
}

function isWritableField(object, fieldName) {
  const fieldDescriptor = Object.getOwnPropertyDescriptor(object, fieldName)
  return fieldDescriptor && fieldDescriptor.writable
}

function isObjectField(object, fieldName) {
  return isWritableField(object, fieldName) && typeof object[fieldName] === 'object'
}

function isPrimitiveField(object, fieldName) {
  return isWritableField(object, fieldName) && typeof object[fieldName] !== 'object'
}

function recursivelyAttachProxy(originalField, fieldName, object, id) {
  if (isObjectField(object, fieldName))
    getFields(object[fieldName]).forEach(nestedFieldName =>
      recursivelyAttachProxy(object[fieldName][nestedFieldName], nestedFieldName, object[fieldName], id))

  if (isPrimitiveField(object, fieldName)) attachProxy(object, fieldName, originalField, id)
}

function attachProxyToProperties<T extends Model>(model: T) {
  getFields(model).forEach(field => {
    recursivelyAttachProxy(model[field], field, model, model.__observableId)
  })
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

function decorate<T extends Model>(model: T) {
  if (!model.__observableId) Object.defineProperty(model, '__observableId', {value: id(), writable: false})
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

function observe<T extends Model>(model: T): T {
  decorate(model)
  attachProxyToProperties(model)
  reactify(model)
  return model
}

export default observe

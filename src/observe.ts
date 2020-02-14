import {useCallback, useEffect, useState} from 'react'
import hash from './hash'

class EventEmitter {
  callbacks = {}

  on(eventId, cb): void {
    this.callbacks[eventId] = this.callbacks[eventId] || []
    this.callbacks[eventId].push(cb)
  }

  remove(eventId): void {
    delete this.callbacks[eventId]
  }

  emit(eventId): void {
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

function getFieldNames(toCheck): string[] {
  let props = []
  let obj = toCheck

  do {
    props = props.concat(Object.getOwnPropertyNames(obj))
  } while ((obj = Object.getPrototypeOf(obj)))
  return props
    .sort()
    .filter((e, i, arr) => e != arr[i + 1] && typeof toCheck[e] !== 'function')
}

function isWritableField(object, fieldName): boolean {
  const fieldDescriptor = Object.getOwnPropertyDescriptor(object, fieldName)
  return fieldDescriptor && fieldDescriptor.writable
}

function isWriteableObjectField(object, fieldName): boolean {
  return (
    isWritableField(object, fieldName) &&
    typeof object[fieldName] === 'object' &&
    object[fieldName] !== null
  )
}

function isWriteablePrimitiveField(object, fieldName): boolean {
  return (
    isWritableField(object, fieldName) &&
    (typeof object[fieldName] !== 'object' || object[fieldName] === null)
  )
}

function isWriteableArray(object, fieldName): boolean {
  return isWritableField(object, fieldName) && Array.isArray(object[fieldName])
}

function attachProxyToProperties<T extends Model>(model: T, id?): void {
  if (!model.__proxyAttached) {
    model.__proxyAttached = true
    getFieldNames(model).forEach(field => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      recursivelyAttachProxy(
        model[field],
        field,
        model,
        id ? id : model.__observableId
      )
    })
  }
}

function attachProxyToField(object, fieldName, originalField, id): void {
  Object.defineProperty(object, fieldName, {
    configurable: true,
    enumerable: true,
    get: () => originalField,
    set: value => {
      if (typeof value === 'object') {
        attachProxyToProperties(value, id)
      }
      originalField = value
      eventEmitter.emit(id)
    }
  })
}

function attachProxyToArray(object, fieldName, id): void {
  object[fieldName] = new Proxy(object[fieldName], {
    get: function(target, property): object {
      return target[property]
    },
    set: function(target, property, value): boolean {
      if (property !== '__proto__' && property !== 'length') {
        target[property] = value
        eventEmitter.emit(id)
      }
      return true
    }
  })
}

function recursivelyAttachProxy(originalField, fieldName, object, id): void {
  if (isWriteablePrimitiveField(object, fieldName))
    return attachProxyToField(object, fieldName, originalField, id)
  if (isWriteableArray(object, fieldName))
    return attachProxyToArray(object, fieldName, id)
  if (isWriteableObjectField(object, fieldName)) {
    attachProxyToField(object, fieldName, originalField, id)
    getFieldNames(object[fieldName]).forEach(nestedFieldName =>
      recursivelyAttachProxy(
        object[fieldName][nestedFieldName],
        nestedFieldName,
        object[fieldName],
        id
      )
    )
    return
  }
}

function addId<T extends Model>(model: T): void {
  if (!model.__observableId)
    Object.defineProperty(model, '__observableId', {
      value: id(),
      writable: false
    })
}

function addHash<T extends Model>(model: T): void {
  if (!model.hash) model.hash = (): string => hash(model)
}

function reactify<T extends Model>(model: T): void {
  const [, stateChange] = useState(model.hash())

  const stateChangeCallback = useCallback(() => {
    stateChange(model.hash())
  }, [model.__observableId])

  useEffect(() => {
    eventEmitter.on(model.__observableId, stateChangeCallback)
    return (): void => eventEmitter.remove(model.__observableId)
  }, [model.__observableId])
}

function decorate<T extends Model>(model: T): void {
  addHash(model)
  addId(model)
}

function observe<T extends Model>(model: T): T {
  decorate(model)
  attachProxyToProperties(model)
  reactify(model)
  return model
}

export default observe

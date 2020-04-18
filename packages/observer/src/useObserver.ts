import {useCallback, useEffect, useRef, useState} from 'react'
import hash from './hash'
import {generateId} from './helpers/generateId'

class EventEmitter {
  callbacks = {}

  on(eventId, subscriptionId, cb): void {
    this.callbacks[eventId] = this.callbacks[eventId] || []
    // eslint-disable-next-line no-param-reassign
    cb.subscriptionId = subscriptionId
    this.callbacks[eventId].push(cb)
  }

  remove(eventId, subscriptionId): void {
    this.callbacks[eventId] = this.callbacks[eventId].filter(
      (c) => c.subscriptionId !== subscriptionId
    )
  }

  emit(eventId): void {
    if (this.callbacks[eventId]) {
      this.callbacks[eventId].forEach((cb) => cb())
    }
  }
}

const eventEmitter = new EventEmitter()

type Model = {
  constructor
  __observableId?: string
  __proxyAttached?: boolean
  hash?: () => string
}

function getFieldNames(toCheck): string[] {
  let props = []
  let obj = toCheck

  do {
    props = props.concat(Object.getOwnPropertyNames(obj))
  } while ((obj = Object.getPrototypeOf(obj)))
  return props
    .sort()
    .filter((e, i, arr) => e !== arr[i + 1] && typeof toCheck[e] !== 'function')
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

function attachProxyToProperties(model: Model, callback: Function, id?): void {
  // *** SAM CHANGE 1 - replaced this: if (!model.__proxyAttached) {
  if (model && !model.__proxyAttached) {

    // eslint-disable-next-line no-param-reassign
    model.__proxyAttached = true
    getFieldNames(model).forEach((field) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      recursivelyAttachProxy(
        model[field],
        field,
        model,
        id || model.__observableId,
        callback
      )
    })
  }
}

function attachProxyToField(
  object,
  fieldName,
  originalField,
  callback,
  id
): void {
  if (fieldName !== '__proxyAttached') {
    try {
      let newProxy = new Proxy(object[fieldName], {
        get(target, property): object {
          return target[property]
        },
        set(target, property, value): boolean {
          if (property !== '__proto__' && property !== 'length') {
            if (typeof value === 'object') {
              attachProxyToProperties(value, callback, id)
            }
            // eslint-disable-next-line no-param-reassign
            target[property] = value
            callback()
          }
          return true
        },
      })

      Object.defineProperty(object, fieldName, {
        configurable: true,
        enumerable: true,
        get: () => {
          return newProxy
        },
        set: (value) => {
          if (!value) return callback() // *** SAM CHANGE 3
          if (typeof value === 'object' && !Array.isArray(value)) {
            attachProxyToProperties(value, callback, id)
          }
          newProxy = new Proxy(value, {
            get(target, property): object {
              return target[property]
            },
            set(target, property, innerValue): boolean {
              if (property !== '__proto__' && property !== 'length') {
                if (typeof innerValue === 'object') {
                  attachProxyToProperties(innerValue, callback, id)
                }
                // eslint-disable-next-line no-param-reassign
                target[property] = innerValue
                callback()
              }
              return true
            },
          })
          callback()
        },
      })
    } catch (e) {
      // This if doesn't seem to make any difference
      if (fieldName !== 'length') {
        Object.defineProperty(object, fieldName, {
          configurable: true,
          enumerable: true,
          get: () => originalField,
          set: (value) => {
            if (originalField === value) return // *** SAM CHANGE 2
            if (typeof value === 'object' && !Array.isArray(value)) {
              attachProxyToProperties(value, callback, id)
            }
            // eslint-disable-next-line no-param-reassign
            originalField = value
            callback()
          },
        })
      }
    }
  }
}

function attachProxyToArray(object, fieldName, callback, id): void {
  object[fieldName].forEach((element, index) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    recursivelyAttachProxy(element, index, object[fieldName], id, callback)
  })

  // eslint-disable-next-line no-param-reassign
  object[`____${fieldName}`] = object[fieldName]
  Object.defineProperty(object, fieldName, {
    configurable: true,
    enumerable: true,
    get: () => object[`____${fieldName}`],
    set: (value) => {
      // eslint-disable-next-line no-param-reassign
      object[`____${fieldName}`] = value
      callback()
    },
  })

  // FIXME this is causing the extra callback in pureObserver.spec tests
  // eslint-disable-next-line no-param-reassign
  object[fieldName] = new Proxy(object[fieldName], {
    get(target, property): object {
      return target[property]
    },
    set(target, property, value): boolean {
      if (property !== '__proto__' && property !== 'length') {
        if (typeof value === 'object') {
          attachProxyToProperties(value, callback, id)
        }
        // eslint-disable-next-line no-param-reassign
        target[property] = value
        callback()
      }
      return true
    },
  })
}

function recursivelyAttachProxy(
  originalField,
  fieldName,
  object,
  id,
  callback: Function
): void {
  if (isWriteablePrimitiveField(object, fieldName))
    return attachProxyToField(object, fieldName, originalField, callback, id)
  if (isWriteableArray(object, fieldName))
    return attachProxyToArray(object, fieldName, callback, id)
  if (isWriteableObjectField(object, fieldName)) {
    attachProxyToField(object, fieldName, originalField, callback, id)
    getFieldNames(object[fieldName]).forEach((nestedFieldName) =>
      recursivelyAttachProxy(
        object[fieldName][nestedFieldName],
        nestedFieldName,
        object[fieldName],
        id,
        callback
      )
    )
  }
  return undefined
}

function addId(model: Model): void {
  if (!model.__observableId)
    Object.defineProperty(model, '__observableId', {
      value: generateId(),
      writable: false,
    })
}

function addHash(model: Model): void {
  // eslint-disable-next-line no-param-reassign
  if (!model.hash) model.hash = (): string => hash(model)
}

let currentId = 0

export function useUniqueId(): string {
  const ref = useRef(0)
  if (ref.current === 0) {
    currentId += 1
    ref.current = currentId
  }
  return `subscription_id${ref.current}`
}

function useReactify(model: Model): Function {
  const subscriptionId = useUniqueId()
  const [, stateChange] = useState(model.hash())

  const stateChangeCallback = useCallback(() => {
    stateChange(model.hash())
  }, [model])

  useEffect(() => {
    eventEmitter.on(model.__observableId, subscriptionId, stateChangeCallback)
    return (): void => eventEmitter.remove(model.__observableId, subscriptionId)
  }, [model.__observableId, subscriptionId, stateChangeCallback])
  return (): void => eventEmitter.emit(model.__observableId)
}

function decorate(model: Model): void {
  addHash(model)
  addId(model)
}

function useObserver<T extends Model>(model: T): T {
  decorate(model)
  const callback = useReactify(model)
  attachProxyToProperties(model, callback)
  return model
}

export function pureObserver<T extends Model>(model: T, callback: Function): T {
  decorate(model)
  attachProxyToProperties(model, callback)
  return model
}

export default useObserver

import {useCallback, useEffect, useRef, useState} from 'react'
import hash from './hash'

// function uuid(){
//   let dt = new Date().getTime();
//   const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = (dt + Math.random()*16)%16 | 0;
//     dt = Math.floor(dt/16);
//     return (c=='x' ? r :(r&0x3|0x8)).toString(16);
//   });
//   return uuid;
// }

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

type Model = {
  constructor
  __useDomainId?: string
  hash?: () => string
}

export default function<T extends Model>(model: T): T {
  if (!model.__useDomainId) {
    // model.__useDomainId = '1' // ALL TESTS PASS WITH THIS!
    model.__useDomainId = `${Math.random()}`
  }

  if (!model.hash) {
    model.hash = function() {
      return hash(this)
    }
  }

  const [currentHash, stateChange] = useState(model.hash())

  const commandsHistoryRef = useRef([])
  if (!commandsHistoryRef.current) {
    commandsHistoryRef.current = []
  }
  const commandsHistory = commandsHistoryRef.current

  const rerunCallback = useCallback(() => {
    stateChange(model.hash())
  }, [model.__useDomainId])

  useEffect(() => {
    eventEmitter.on(model.__useDomainId, rerunCallback)
    return () => eventEmitter.remove(model.__useDomainId)
  }, [model.__useDomainId])

  const domainModel = {}

  function attachMethod(method, name) {
    domainModel[name] = (...args) => {
      const returnValue = method.apply(model, args)
      if (currentHash !== model.hash()) {
        commandsHistory.push({
          command: name,
          args,
          id: commandsHistory.length
        })
        eventEmitter.emit(model.__useDomainId)
        // do not need this anymore
        // stateChange(model.hash())
      }
      return returnValue
    }
  }

  function getAllMethods(toCheck) {
    let props = []
    let obj = toCheck
    do {
      props = props.concat(Object.getOwnPropertyNames(obj))
    } while ((obj = Object.getPrototypeOf(obj)))

    return props.sort().filter(function(e, i, arr) {
      if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true
    })
  }

  function getAllButMethods(toCheck) {
    let props = []
    let obj = toCheck
    do {
      props = props.concat(Object.getOwnPropertyNames(obj))
    } while ((obj = Object.getPrototypeOf(obj)))

    return props.sort().filter(function(e, i, arr) {
      if (e != arr[i + 1] && typeof toCheck[e] !== 'function') return true
    })
  }

  getAllMethods(model).forEach(methodName => {
    attachMethod(model[methodName], methodName)
  })

  const attachProxy = (originalNotMethod, notMethodName, object = model) => {
    if (
      Object.getOwnPropertyDescriptor(object, notMethodName) &&
      Object.getOwnPropertyDescriptor(object, notMethodName).writable &&
      notMethodName !== '__useDomainId'
    ) {
      if (typeof object[notMethodName] === 'object') {
        getAllButMethods(object[notMethodName]).forEach(nestedNotMethodName => {
          attachProxy(
            object[notMethodName][nestedNotMethodName],
            nestedNotMethodName,
            model[notMethodName]
          )
        })
      } else {
        Object.defineProperty(object, notMethodName, {
          configurable: true,
          enumerable: true,
          get: function() {
            return originalNotMethod
          },
          set: function(value) {
            originalNotMethod = value
            eventEmitter.emit(model.__useDomainId)
          }
        })
      }
    }
  }

  getAllButMethods(model).forEach(notMethodName => {
    attachProxy(model[notMethodName], notMethodName)
  })

  return model
}

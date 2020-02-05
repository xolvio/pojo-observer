import {useState, useRef} from 'react'

export interface Model {
  [key: string]: any

  hash: () => string
  commands?: {[key: string]: (...any) => any}
  queries?: {[key: string]: (...any) => any}
}

export default function useDomain(model: Model) {
  const [, stateChange] = useState(model.hash())

  const commandsHistoryRef = useRef([])
  if (!commandsHistoryRef.current) {
    commandsHistoryRef.current = []
  }
  const commandsHistory = commandsHistoryRef.current

  const domainModel = {queries: {}, commands: {}}

  function attachQuery(query, name) {
    domainModel.queries[name] = query
  }

  function attachCommand(command, name) {
    if (name.indexOf('__set__') !== -1) {
      model[name] = () => stateChange(model.hash())
    } else {
      domainModel.commands[name] = (...args) => {
        const returnValue = command.apply(model, args)
        commandsHistory.push({command: name, args, id: commandsHistory.length})
        stateChange(model.hash())
        return returnValue
      }
    }
  }

  function useExplicitStrategy() {
    Object.keys(model.queries).forEach(query =>
      attachQuery(model.queries[query], query)
    )
    Object.keys(model.commands).forEach(command => {
      return attachCommand(model.commands[command], command)
    })
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

  function useDecoratorStrategy() {
    getAllMethods(model).forEach(methodName => {
      if (model[methodName].query) attachQuery(model[methodName], methodName)
      if (model[methodName].command)
        attachCommand(model[methodName], methodName)
    })
  }

  if (model.commands && model.queries) {
    useExplicitStrategy()
  } else {
    useDecoratorStrategy()
  }

  return [domainModel.queries, domainModel.commands, commandsHistory]
}

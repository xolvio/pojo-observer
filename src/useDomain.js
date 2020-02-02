import {useState, useRef} from 'react'

export default function useDomain(model) {

  const [, stateChange] = useState(model.hash())

  const commandsHistoryRef = useRef()
  if (!commandsHistoryRef.current) {
    commandsHistoryRef.current = []
  }
  const commandsHistory = commandsHistoryRef.current

  const domainModel = {queries: {}, commands: {}}

  function attachQuery(query) {
    domainModel.queries[query.name] = query
  }

  function attachCommand(command) {
    domainModel.commands[command.name] = (...args) => {
      const returnValue = command.apply(model, args)
      commandsHistory.push({command: command.name, args, id: commandsHistory.length})
      stateChange(model.hash())
      return returnValue
    }
  }

  function useExplicitStrategy() {
    Object.keys(model.queries).forEach((query) => attachQuery(model.queries[query]))
    Object.keys(model.commands).forEach((command) => attachCommand(model.commands[command]))
  }

  function useDecoratorStrategy() {
    Object.keys(model).forEach((method) => {
        if (model[method].query) attachQuery(model[method])
        if (model[method].command) attachCommand(model[method])
      }
    )
  }

  if (model.commands && model.queries) {
    useExplicitStrategy()
  } else {
    useDecoratorStrategy()
  }

  return [domainModel.queries, domainModel.commands, commandsHistory]
}


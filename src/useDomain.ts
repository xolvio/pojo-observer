import {useState, useRef} from 'react'

export default function useDomain(model) {
  const [, stateChange] = useState(model.hash())

  const commandsHistoryRef = useRef()
  if (!commandsHistoryRef.current) {
    commandsHistoryRef.current = []
  }
  const commandsHistory = commandsHistoryRef.current

  const domainModel = {queries: {}, commands: {}}

  function attachQuery(query, name) {
    domainModel.queries[name] = query
  }

  function attachCommand(command, name) {
    domainModel.commands[name] = (...args) => {
      const returnValue = command.apply(model, args)
      commandsHistory.push({command: name, args, id: commandsHistory.length})
      stateChange(model.hash())
      return returnValue
    }
  }

  function useExplicitStrategy() {
    Object.keys(model.queries).forEach(query =>
      attachQuery(model.queries[query], query)
    )
    Object.keys(model.commands).forEach(command =>
      attachCommand(model.commands[command], command)
    )
  }

  function useDecoratorStrategy() {
    Object.keys(model).forEach(method => {
      if (model[method].query) attachQuery(model[method], method)
      if (model[method].command) attachCommand(model[method], method)
    })
  }

  if (model.commands && model.queries) {
    useExplicitStrategy()
  } else {
    useDecoratorStrategy()
  }

  return [domainModel.queries, domainModel.commands, commandsHistory]
}

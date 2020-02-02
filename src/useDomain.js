import {useState, useRef} from 'react'

// any command that changes state will make the hooked component re-render
export default function useDomain(model) {

  const [, stateChange] = useState(model.hash())
  const commandsHistoryRef = useRef()

  // keep a history which can be used for all sorts of use-cases like testing, undo buffers, entire UI interaction dump for debugging, etc
  // Kudos to @TillaTheHun0 for the history addition
  if (!commandsHistoryRef.current) {
    commandsHistoryRef.current = []
  }
  const commandsHistory = commandsHistoryRef.current

  const domainModel = {queries: {}, commands: {}}

  // queries get delegated as-is since they don't update state
  Object.keys(model.queries).forEach((query) =>
    domainModel.queries[query] = model.queries[query]
  )

  // commands use a hash to see if the model has changed
  Object.keys(model.commands).forEach((command) => {
    domainModel.commands[command] = (...args) => {

      model.commands[command].apply(model, args)

      // maybe deep copy model here and include on the commandsHistory
      commandsHistory.push({command, args, id: commandsHistory.length})

      stateChange(model.hash())
    }
  })

  return [domainModel.queries, domainModel.commands, commandsHistory]
}


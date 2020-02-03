import hash from './hash'

export default function toCQRSWithHash({model, commands = [], queries = []}) {
  return {
    hash: () => hash(model),
    commands: commands.reduce((obj, command) => {
      obj[command.name] = command.bind(model)
      return obj
    }, {}),
    queries: queries.reduce((obj, query) => {
      obj[query.name] = query.bind(model)
      return obj
    }, {})
  }
}

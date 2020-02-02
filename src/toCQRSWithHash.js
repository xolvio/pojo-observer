// Takes in a POJO model with a set of commands and queries, and spits out an CQ object with a hash method
// This is the interface required by the useDomain hook, which allows domain entities to be used in React views

export default function toCQRSWithHash({model, commands = [], queries = []}) {
  return {
    hash: () => require('object-hash')(model),
    commands: commands.reduce((obj, command) => {
      obj[command.name] = command.bind(model)
      return obj
    }, {}),
    queries: queries.reduce((obj, query) => {
      obj[query.name] = query.bind(model)
      return obj
    }, {}),
  }
}

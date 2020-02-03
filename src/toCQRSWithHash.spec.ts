import toCQRSWithHash from './toCQRSWithHash'

describe('toCQRSHarsh', () => {
  describe('hash', () => {
    it('should provide a hash method on the returned object', function() {
      expect(typeof toCQRSWithHash({model: {}}).hash()).toEqual('string')
    })
  })

  describe('command & query delegation', () => {
    class Foo {
      do(thing) {
        this.thing = thing
      }

      make() {
        this.things = this.thing + 's'
      }

      showThing() {
        return this.thing
      }

      showThings() {
        return this.things
      }
    }

    it('should delegate the provided commands and queries and apply to the underlying model', () => {
      const foo = new Foo()
      const fooWithCQRSHash = toCQRSWithHash({
        model: foo,
        commands: [foo.do],
        queries: [foo.showThing]
      })

      fooWithCQRSHash.commands.do('something')

      expect(fooWithCQRSHash.queries.showThing()).toEqual('something')
    })

    it('should delegate multiple commands and queries and apply to the underlying model', () => {
      const foo = new Foo()

      const fooWithCQRSHash = toCQRSWithHash({
        model: foo,
        commands: [foo.do, foo.make],
        queries: [foo.showThing, foo.showThings]
      })

      fooWithCQRSHash.commands.do('thing')
      fooWithCQRSHash.commands.make()

      expect(fooWithCQRSHash.queries.showThing()).toEqual('thing')
      expect(fooWithCQRSHash.queries.showThings()).toEqual('things')
    })
  })
})

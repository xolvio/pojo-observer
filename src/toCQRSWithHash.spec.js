import toCQRSWithHash from './toCQRSWithHash'

describe('toCQRSHarsh', () => {
  describe('hash', () => {

    class Foo {
      constructor(x, y) {
        this.x = x
        this.y = y
      }
    }

    class Bar {
      constructor(x, y) {
        this.x = x
        this.y = y
      }
    }

    it('should provide the same hash when the model values are the same', () => {
      const foo = new Foo(1, 2)
      const fooWithCQRSHash = toCQRSWithHash({model: foo})

      const hash1 = fooWithCQRSHash.hash()
      const hash2 = fooWithCQRSHash.hash()

      expect(hash1).toEqual(hash2)
    })
    it('should provide a different hash when model values change', () => {
      const foo = new Foo(1, 2)
      const fooWithCQRSHash = toCQRSWithHash({model: foo})

      const hash1 = fooWithCQRSHash.hash()

      foo.x = 5
      const hash2 = fooWithCQRSHash.hash()

      expect(hash1).not.toEqual(hash2)
    })
    it('should return a different hash for different instances of the same class with the same values', () => {
      const foo1 = new Foo(1, 2)
      const foo2 = new Bar(1, 2)

      const foo1WithCQRSHash = toCQRSWithHash({model: foo1})
      const foo2WithCQRSHash = toCQRSWithHash({model: foo2})

      expect(foo1WithCQRSHash.hash()).not.toEqual(foo2WithCQRSHash.hash())
    })
    it('should return a different hash for different classes with the same values', function () {
      const foo = new Foo(1, 2)
      const bar = new Bar(1, 2)

      const fooWithCQRSHash = toCQRSWithHash({model: foo})
      const barWithCQRSHash = toCQRSWithHash({model: bar})

      expect(fooWithCQRSHash.hash()).not.toEqual(barWithCQRSHash.hash())
    })
    it('should return the same hash for different anonymous objects with the same values', () => {
      const foo = {x: 1, y: 2}
      const bar = {x: 1, y: 2}
      const fooWithCQRSHash = toCQRSWithHash({model: foo})
      const barWithCQRSHash = toCQRSWithHash({model: bar})

      const hash1 = fooWithCQRSHash.hash()
      const hash2 = barWithCQRSHash.hash()

      expect(hash1).toEqual(hash2)
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

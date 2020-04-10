import hash from './hash'

describe('hash', () => {
  class Foo {
    public x: any
    public y: any

    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }

  class Bar {
    public x: any
    public y: any

    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }

  it('should provide the same hash when the model values are the same', () => {
    const foo = new Foo(1, 2)

    const hash1 = hash(foo)
    const hash2 = hash(foo)

    expect(hash1).toEqual(hash2)
  })
  it('should provide a different hash when model values change', () => {
    const foo = new Foo(1, 2)

    const hash1 = hash(foo)

    foo.x = 5
    const hash2 = hash(foo)

    expect(hash1).not.toEqual(hash2)
  })
  it('should return a the same hash for different instances of the same class with the same values', () => {
    const foo1 = new Foo(1, 2)
    const foo2 = new Foo(1, 2)

    expect(hash(foo1)).toEqual(hash(foo2))
  })
  it('should return a different hash for different classes with the same values', function() {
    const foo = new Foo(1, 2)
    const bar = new Bar(1, 2)

    expect(hash(foo)).not.toEqual(hash(bar))
  })
  it('should return the same hash for different anonymous objects with the same values', () => {
    const foo = {x: 1, y: 2}
    const bar = {x: 1, y: 2}

    const hash1 = hash(foo)
    const hash2 = hash(bar)

    expect(hash1).toEqual(hash2)
  })
})

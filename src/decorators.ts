import hash from './hash'

export function live(target, key: string, descriptor) {
  target['__' + key] = descriptor.initializer()
  target[`__set__${key}`] = () => null
  target[`__set__${key}`].command = true

  return {
    set: function(value) {
      this['__' + key] = value
      this[`__set__${key}`]()
    },
    get: function() {
      return this['__' + key]
    },
    enumerable: true,
    configurable: true
  }
}

export function command(target, key: string, descriptor) {
  // anonymous class methods
  if (descriptor.initializer) {
    const initializerResult = descriptor.initializer()
    initializerResult.command = true
    descriptor.initializer = function() {
      return initializerResult
    }
  }

  // setters
  if (descriptor.set) {
    target[`__set__${key}`] = () => null
    target[`__set__${key}`].command = true
    const setter = descriptor.set
    descriptor.set = function(...args) {
      setter.apply(this, args)
      this[`__set__${key}`]()
    }
  }

  // normal methods
  if (!descriptor.initializer && !descriptor.set) {
    descriptor.value.command = true
  }

  return descriptor
}

export function query(target, key: string, descriptor) {
  // anonymous class methods
  if (descriptor.initializer) {
    const resultOf = descriptor.initializer()
    resultOf.query = true
    descriptor.initializer = function() {
      return resultOf
    }
  }

  // normal methods
  if (!descriptor.initializer && !descriptor.get) {
    descriptor.value.query = true
    return descriptor
  }
}

export function hashable<T extends {new (...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    hash = () => {
      return hash(this)
    }
  }
}

import hash from './hash'

export function command(target, key: string, descriptor) {
  if (descriptor.initializer) {
    const resultOf = descriptor.initializer()
    resultOf.command = true
    descriptor.initializer = function() {
      return resultOf
    }
  } else {
    descriptor.value.command = true
  }
  return descriptor
}

export function query(target, key: string, descriptor) {
  if (descriptor.initializer) {
    const resultOf = descriptor.initializer()
    resultOf.query = true
    descriptor.initializer = function() {
      return resultOf
    }
  } else {
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

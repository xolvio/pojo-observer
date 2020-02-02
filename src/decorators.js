import hash from 'object-hash'

export function command(target, key, descriptor) {
  descriptor.value.command = true
  return descriptor
}

export function query(target, key, descriptor) {
  descriptor.value.query = true
  return descriptor
}

export function hashable(constructor) {
  return class extends constructor {
    hash = () => {
      return hash(this)
    }
  }
}

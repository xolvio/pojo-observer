import {WithHash} from "./withHash";

class Disposable {
  isDisposed: boolean
  dispose() {
    this.isDisposed = true
  }
}

// Activatable Mixin
class Activatable {
  isActive: boolean
  activate() {
    this.isActive = true
  }
  deactivate() {
    this.isActive = false
  }
}

class SmartObject {
  constructor() {
    setInterval(() => console.log(this.isActive + ' : ' + this.isDisposed), 500)
  }

  interact() {
    this.activate()
  }
}

class Hashable implements WithHash {
    hash() {
        return ''
    }
}


interface SmartObject extends Disposable, Activatable, Hashable {}
applyMixins(SmartObject, [Disposable, Activatable, Hashable])

let smartObj = new SmartObject()

setTimeout(() => smartObj.interact(), 1000)

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    })
  })
}


// smartObj

import IEventEmitter from "./IEventEmitter"
import IDomainEvent from "./IDomainEvent"

export default class SimpleEventEmitter implements IEventEmitter {
  _callbacks: {[key: string]: Function[] } = {}
  on(clazz: any, callback: Function): void {
    const eventHash = clazz.name
    console.log('on', eventHash)
    this._callbacks[eventHash] = this._callbacks[eventHash] || []
    this._callbacks[eventHash].push(callback)
  }

  emit(event: IDomainEvent): void {
    const eventHash = event.constructor.name
    console.log('emit', eventHash)
    this._callbacks[eventHash] && this._callbacks[eventHash].forEach(cb => cb(event))
  }
}

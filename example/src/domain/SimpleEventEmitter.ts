import IEventEmitter from "./IEventEmitter"
import IDomainEvent from "./IDomainEvent"

export default class SimpleEventEmitter implements IEventEmitter {
  _callbacks = {}
  on(eventName: string, callback: Function): void {
    // @ts-ignore
    this._callbacks[eventName] = this._callbacks[eventName] || []
    // @ts-ignore
    this._callbacks[eventName].push(callback)
  }

  emit(event: IDomainEvent): void {
    const eventHash = event.constructor.name
    // @ts-ignore
    this._callbacks[eventHash] && this._callbacks[eventHash].forEach(cb => cb(event))
  }
}

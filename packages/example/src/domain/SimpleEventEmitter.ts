import {IEventEmitter} from "./IEventEmitter"
import {IDomainEvent} from "./IDomainEvent"

export class SimpleEventEmitter implements IEventEmitter {
  _callbacks: { [key: string]: Function[] } = {}

  on<T>(event: { new(...args: any[]): T }, callback: (e: T) => void): void {
    const eventHash = event.name
    this._callbacks[eventHash] = this._callbacks[eventHash] || []
    this._callbacks[eventHash].push(callback)
  }

  emit(event: IDomainEvent): void {
    const eventHash = event.constructor.name
    this._callbacks[eventHash] && this._callbacks[eventHash].forEach(cb => cb(event))
  }
}

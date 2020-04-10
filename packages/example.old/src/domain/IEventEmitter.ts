import IDomainEvent from "./IDomainEvent"

export default interface IEventEmitter {
  on<T>(event: {new(...args: any[]): T}, callback: (e: T) => void): void
  emit(event: IDomainEvent): void
}

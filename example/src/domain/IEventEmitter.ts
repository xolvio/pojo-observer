import IDomainEvent from "./IDomainEvent"

export default interface IEventEmitter {
  emit(event: IDomainEvent): void
  on(event: string, callback: Function): void
}

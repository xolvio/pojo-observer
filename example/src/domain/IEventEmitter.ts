import IDomainEvent from "./IDomainEvent"

export default interface IEventEmitter {
  on(event: any, callback: Function): void
  emit(event: IDomainEvent): void
}


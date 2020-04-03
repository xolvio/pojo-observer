import IDomainEvent from "./IDomainEvent"

export default interface IEventEmitter {
  emit(event: IDomainEvent): void
  on(event: any, callback: Function): void
}


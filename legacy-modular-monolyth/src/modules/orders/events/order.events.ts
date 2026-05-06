export class OrderCreatedEvent {
  static readonly NAME = 'order.created';
  constructor(
    public readonly orderId: number,
    public readonly userId: number | null,
    public readonly total: string,
    public readonly status: string,
  ) {}
}

export class OrderUpdatedEvent {
  static readonly NAME = 'order.updated';
  constructor(
    public readonly orderId: number,
    public readonly total: string,
    public readonly status: string,
  ) {}
}

export class OrderDeletedEvent {
  static readonly NAME = 'order.deleted';
  constructor(public readonly orderId: number) {}
}

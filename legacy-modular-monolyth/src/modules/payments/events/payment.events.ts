export class PaymentCreatedEvent {
  static readonly NAME = 'payment.created';
  constructor(
    public readonly paymentId: number,
    public readonly orderId: number,
    public readonly amount: string,
    public readonly status: string,
  ) {}
}

export class PaymentUpdatedEvent {
  static readonly NAME = 'payment.updated';
  constructor(
    public readonly paymentId: number,
    public readonly orderId: number,
    public readonly status: string,
  ) {}
}

export class PaymentDeletedEvent {
  static readonly NAME = 'payment.deleted';
  constructor(public readonly paymentId: number) {}
}

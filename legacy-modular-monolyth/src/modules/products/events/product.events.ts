export class ProductCreatedEvent {
  static readonly NAME = 'product.created';
  constructor(
    public readonly productId: number,
    public readonly name: string,
    public readonly price: string,
  ) {}
}

export class ProductUpdatedEvent {
  static readonly NAME = 'product.updated';
  constructor(
    public readonly productId: number,
    public readonly name: string,
    public readonly price: string,
  ) {}
}

export class ProductDeletedEvent {
  static readonly NAME = 'product.deleted';
  constructor(public readonly productId: number) {}
}

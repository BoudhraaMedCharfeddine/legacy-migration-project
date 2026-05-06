export class CategoryCreatedEvent {
  static readonly NAME = 'category.created';
  constructor(
    public readonly categoryId: number,
    public readonly name: string,
  ) {}
}

export class CategoryUpdatedEvent {
  static readonly NAME = 'category.updated';
  constructor(
    public readonly categoryId: number,
    public readonly name: string,
  ) {}
}

export class CategoryDeletedEvent {
  static readonly NAME = 'category.deleted';
  constructor(public readonly categoryId: number) {}
}

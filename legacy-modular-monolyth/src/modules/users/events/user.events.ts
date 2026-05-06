export class UserCreatedEvent {
  static readonly NAME = 'user.created';
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly email: string,
  ) {}
}

export class UserUpdatedEvent {
  static readonly NAME = 'user.updated';
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly email: string,
  ) {}
}

export class UserDeletedEvent {
  static readonly NAME = 'user.deleted';
  constructor(public readonly userId: number) {}
}

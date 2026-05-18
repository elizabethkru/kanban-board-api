export class GetCardQuery {
  constructor(
    public readonly cardId: string,
    public readonly userId: string,
  ) {}
}

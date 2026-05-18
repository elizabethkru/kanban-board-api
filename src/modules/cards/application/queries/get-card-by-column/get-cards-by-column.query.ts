export class GetCardsByColumnQuery {
  constructor(
    public readonly columnId: string,
    public readonly userId: string,
  ) {}
}

export class GetColumnQuery {
  constructor(
    public readonly columnId: string,
    public readonly userId: string,
  ) {}
}

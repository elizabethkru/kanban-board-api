export class GetColumnsByBoardQuery {
  constructor(
    public readonly boardId: string,
    public readonly userId: string,
  ) {}
}

export class GetBoardQuery {
  constructor(
    public readonly boardId: string,
    public readonly userId: string,
  ) {}
}
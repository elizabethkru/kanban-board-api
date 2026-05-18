export class MoveCardCommand {
  constructor(
    public readonly cardId: string,
    public readonly targetColumnId: string,
    public readonly newPosition: number,
    public readonly userId: string,
  ) {}
}

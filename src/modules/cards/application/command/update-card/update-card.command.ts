export class UpdateCardCommand {
  constructor(
    public readonly cardId: string,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly userId: string,
  ) {}
}

export class DeleteCardCommand {
  constructor(
    public readonly cardId: string,
    public readonly userId: string,
  ) {}
}

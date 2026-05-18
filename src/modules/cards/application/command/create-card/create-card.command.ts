export class CreateCardCommand {
  constructor(
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly columnId: string,
    public readonly userId: string,
  ) {}
}

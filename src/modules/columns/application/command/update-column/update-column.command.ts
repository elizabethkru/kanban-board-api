export class UpdateColumnCommand {
  constructor(
    public readonly columnId: string,
    public readonly title: string,
    public readonly userId: string,
  ) {}
}

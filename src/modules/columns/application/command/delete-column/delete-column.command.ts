export class DeleteColumnCommand {
  constructor(
    public readonly columnId: string,
    public readonly userId: string,
  ) {}
}

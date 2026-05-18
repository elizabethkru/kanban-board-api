export class ColumnTitle {
  private constructor(private readonly value: string) {}

  static create(value: string): ColumnTitle {
    if (!value || value.trim().length === 0) {
      throw new Error('Column title cannot be empty');
    }
    if (value.length > 50) {
      throw new Error('Column title cannot exceed 50 characters');
    }
    return new ColumnTitle(value.trim());
  }

  getValue(): string {
    return this.value;
  }
}

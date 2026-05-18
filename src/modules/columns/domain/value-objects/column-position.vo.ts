export class ColumnPosition {
  private constructor(private readonly value: number) {}

  static create(value: number): ColumnPosition {
    if (value < 0) throw new Error('Position must be non-negative');
    return new ColumnPosition(value);
  }

  getValue(): number {
    return this.value;
  }
}

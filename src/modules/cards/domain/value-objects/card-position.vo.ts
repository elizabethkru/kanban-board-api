export class CardPosition {
  private constructor(private readonly value: number) {}

  static create(value: number): CardPosition {
    if (value < 0) throw new Error('Position must be non-negative');
    return new CardPosition(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: CardPosition): boolean {
    return this.value === other.value;
  }
}

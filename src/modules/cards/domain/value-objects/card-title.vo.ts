export class CardTitle {
  private constructor(private readonly value: string) {}

  static create(value: string): CardTitle {
    if (!value || value.trim().length === 0) {
      throw new Error('Card title cannot be empty');
    }
    if (value.length > 50) {
      throw new Error('Card title cannot exceed 50 characters');
    }
    return new CardTitle(value.trim());
  }

  getValue(): string {
    return this.value;
  }
}

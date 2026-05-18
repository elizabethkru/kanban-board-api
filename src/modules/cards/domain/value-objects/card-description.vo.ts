export class CardDescription {
  private constructor(private readonly value: string | null) {}

  static create(value?: string): CardDescription {
    if (value && value.length > 1000) throw new Error('Description too long');
    return new CardDescription(value?.trim() || null);
  }

  getValue(): string | null {
    return this.value;
  }
}

import * as crypto from 'crypto';

export class CardUuid {
  private constructor(private readonly value: string) {}

  static generate(): CardUuid {
    return new CardUuid(crypto.randomUUID());
  }

  static fromString(value: string): CardUuid {
    if (!value) throw new Error('Card UUID cannot be empty');
    return new CardUuid(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: CardUuid): boolean {
    return this.value === other.value;
  }
}

import * as crypto from 'crypto';

export class ColumnUuid {
  private constructor(private readonly value: string) {}

  static generate(): ColumnUuid {
    return new ColumnUuid(crypto.randomUUID());
  }

  static fromString(value: string): ColumnUuid {
    if (!value) throw new Error('Column UUID cannot be empty');
    return new ColumnUuid(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ColumnUuid): boolean {
    return this.value === other.value;
  }
}

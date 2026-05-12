import * as crypto from 'crypto';

export class BoardUuid {
  constructor(private value: string) {}

  static generate(): BoardUuid {
    return new BoardUuid(crypto.randomUUID());
  }

  get uuid(): string {
    return this.value;
  }

  toString = (): string => this.value;

  static fromString(value: string): BoardUuid {
    if (!value) throw new Error('UUID cannot be empty');
    return new BoardUuid(value);
  }
}
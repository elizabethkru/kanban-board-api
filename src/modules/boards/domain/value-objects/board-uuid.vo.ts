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
}
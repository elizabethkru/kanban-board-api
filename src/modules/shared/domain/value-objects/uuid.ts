import * as crypto from 'crypto';

export class Uuid {
  constructor(private value: string) {}

  static random(): Uuid {
    return new Uuid(crypto.randomUUID());
  }

  get uuid(): string {
    return this.value;
  }

  toString = (): string => this.value;
}

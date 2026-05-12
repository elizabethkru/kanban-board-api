export class BaseException extends Error {
  constructor(
    protected readonly status: number = 400,
    protected readonly customErrorCode: string = 'unknown_error',
  ) {
    super();
  }

  getStatus(): number {
    return this.status;
  }

  getErrorCode(): string {
    return this.customErrorCode;
  }
}

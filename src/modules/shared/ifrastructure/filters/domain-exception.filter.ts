import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseException } from '../../domain/exceptions/base-domain.exception';
import { Response } from 'express';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const error = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: exception.getErrorCode(),
    };

    response.status(status).json(error);
  }
}

// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, catchError } from 'rxjs';
// import * as Sentry from '@sentry/node';

// @Injectable()
// export class SentryInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       catchError((error) => {
//         Sentry.captureException(error);
//         throw error;
//       }),
//     );
//   }
// }

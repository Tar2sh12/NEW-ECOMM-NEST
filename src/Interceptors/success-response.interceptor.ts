import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    private message: string;
  constructor(message?: string) {
    this.message = message || 'Request successful';
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // This for success responses
                const ctx = context.switchToHttp();
        const res = ctx.getResponse();

        const statusCode = res.statusCode || 200;

        return {
          success: true,
          statusCode,
          timestamp: new Date().toISOString(),
          message: this.message,
          data: this.getData(data),
        };
      }),
    );
  }
    private getData(data: any): any {
    if (!data) return null;

    // Remove message from data if it exists
    if (typeof data === 'object' && data.message) {
      const { message, ...rest } = data;
      return rest;
    }

    return data;
  }
}

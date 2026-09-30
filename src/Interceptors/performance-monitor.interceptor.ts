import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class PerformanceMonitorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    return next.handle().pipe(
      tap(() => {
        const end = Date.now();
        const duration = end - start;
        if (context?.switchToHttp()?.getRequest()?.url) {
          console.log(
            `Request to ${context.switchToHttp().getRequest().originalUrl} took ${duration}ms`,
          );
        }
        else{
          console.log(`Request to ${gqlContext.getContext().req.originalUrl} took ${duration}ms`);
        }
      }),
    );
  }
}

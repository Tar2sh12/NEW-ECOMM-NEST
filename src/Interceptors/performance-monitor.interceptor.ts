import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import {  tap } from "rxjs/operators";

@Injectable()
export class PerformanceMonitorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start= Date.now();

    return next.handle().pipe(
      tap(() => {
        const end = Date.now();
        const duration = end - start;
        console.log(`Request to ${context.switchToHttp().getRequest().url} took ${duration}ms`);
      })
    );
  }
}

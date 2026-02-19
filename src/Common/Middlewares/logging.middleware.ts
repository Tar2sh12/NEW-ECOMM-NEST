import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 **Middlewares 🛑 (Pre-processing)** 
**📌 What Are Middlewares?**
- Middleware functions execute **before** the request reaches the route handler.
- They are mainly used for **logging, authentication, request modification, or security-related tasks**.
- They **do not have access to the response data** because they run **before** the controller processes the request.

**📌 When to Use?**
✅ Logging
✅ Authentication & Authorization
✅ Request Transformation
✅ CORS handling
✅ Rate Limiting
*/
export function loggingMiddleware( // functional middleware
  req: Request,
  res: Response,
  next: NextFunction,
) { 
  const { method, originalUrl } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${originalUrl}`);
  next();
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware { // class based middleware 
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${originalUrl}`);
    next();
  }
}
// we cannot to app.use(LoggerMiddleware) because it is a class based middleware, app.use(loggingMiddleware) only applicable with functional middleware

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx['contextType'] === 'http') {
      const gqlContext = ctx.switchToHttp().getRequest();
      return gqlContext.authUser;
    } else if (ctx['contextType'] === 'graphql') {
      const request = GqlExecutionContext.create(ctx).getContext();
      return request.authUser; 
    }
  },
);

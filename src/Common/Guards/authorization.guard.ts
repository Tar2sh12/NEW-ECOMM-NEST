import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (context['contextType'] === 'http') {
        const request = context.switchToHttp().getRequest();
        const authUserRole = request['authUser'].user.role;
        //const requiredRoles = this.reflector.getAllAndMerge(Roles,[context.getHandler(), context.getClass()]);//roles set by decorator on route handler and the whole controller and merges them
        //const requiredRolesController = this.reflector.get(Roles,context.getClass());//roles set by decorator on the whole controller

        const requiredRoles = this.reflector.get('roles', context.getHandler()); //roles set by decorator on the whole controller
        //console.log(requiredRoles);

        if (!requiredRoles || requiredRoles.length === 0) {
          //no roles specified, allow access
          return true;
        } else if (requiredRoles.includes(authUserRole)) {
          //user has one of the required roles, allow access
          return true;
        } else {
          throw new UnauthorizedException(
            'You do not have permission to access this resource',
          );
        }
      }
      else if (context['contextType'] === 'graphql') {
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const authUserRole = gqlContext['authUser'].user.role;
        //const requiredRoles = this.reflector.getAllAndMerge(Roles,[context.getHandler(), context.getClass()]);//roles set by decorator on route handler and the whole controller and merges them
        //const requiredRolesController = this.reflector.get(Roles,context.getClass());//roles set by decorator on the whole controller

        const requiredRoles = this.reflector.get('roles', context.getHandler()); //roles set by decorator on the whole controller
        //console.log(requiredRoles);

        if (!requiredRoles || requiredRoles.length === 0) {
          //no roles specified, allow access
          return true;
        } else if (requiredRoles.includes(authUserRole)) {
          //user has one of the required roles, allow access
          return true;
        } else {
          throw new UnauthorizedException(
            'You do not have permission to access this resource',
          );
        }
      }
    } catch (error) {
      console.log('authorization guard error', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error(error['message'] || 'Something went wrong');
    }
  }
}

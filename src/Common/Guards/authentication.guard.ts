import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../Services';
import { UserRepository } from 'src/DB/Repositories';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = request.headers;
    if (!token) {
      throw new UnauthorizedException('Please login first');
    }
    try {
      const decoded = this.tokenService.verify(token, {
        secret: process.env.LOGIN_ACCESS_TOKEN_SECRET,
      });
      const user = await this.userRepository.findOne({
        filters: { _id: decoded['userId'] },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      request.authUser = user;
    } catch (error) {
      console.log('auth guard error', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }

    return true;
  }
}

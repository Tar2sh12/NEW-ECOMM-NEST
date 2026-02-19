import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './Controllers/auth.controller';
import { AuthService } from './Services/auth.service';
import {
  OTPRepository,
  RevokedTokensRepository,
  UserRepository,
} from 'src/DB/Repositories';
import { OtpModel, RevokedTokensModel, UserModel } from 'src/DB/Models';
import { TokenService } from 'src/Common/Services';
import { JwtService } from '@nestjs/jwt';
import { loggingMiddleware,LoggerMiddleware } from 'src/Common/Middlewares';
@Module({
  imports: [UserModel, OtpModel, RevokedTokensModel],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    OTPRepository,
    TokenService,
    JwtService,
    RevokedTokensRepository,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(loggingMiddleware).forRoutes(AuthController); // applied all over the controller routes but we can also apply it to specific routes like below

    // consumer.apply(loggingMiddleware).forRoutes({
    //   path:"*",
    //   method: RequestMethod.GET // this will apply the logging middleware to all GET requests of this controller
    // });

    consumer.apply(LoggerMiddleware).forRoutes(AuthController); // used class based middleware instead of functional middleware
  }
}

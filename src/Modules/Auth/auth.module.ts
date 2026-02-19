import { Module } from '@nestjs/common';
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
export class AuthModule {}

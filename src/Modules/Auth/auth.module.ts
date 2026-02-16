import { Module } from '@nestjs/common';
import { AuthController } from './Controllers/auth.controller';
import { AuthService } from './Services/auth.service';
import { OTPRepository, UserRepository } from 'src/DB/Repositories';
import { OtpModel, UserModel } from 'src/DB/Models';
import { TokenService } from 'src/Common/Services';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [UserModel,OtpModel],
  controllers: [AuthController],
  providers: [AuthService,UserRepository,OTPRepository,TokenService,JwtService],
})
export class AuthModule {}
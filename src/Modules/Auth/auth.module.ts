import { Module } from '@nestjs/common';
import { AuthController } from './Controllers/auth.controller';
import { AuthService } from './Services/auth.service';
import { UserRepository } from 'src/DB/Repositories';
import { UserModel } from 'src/DB/Models';
@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService,UserRepository],
})
export class AuthModule {}
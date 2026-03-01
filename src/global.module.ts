import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/Common/Services';
import { RevokedTokensModel, UserModel } from 'src/DB/Models';
import { RevokedTokensRepository, UserRepository } from 'src/DB/Repositories';

@Global()
@Module({
  imports: [UserModel, RevokedTokensModel],
  controllers: [],
  providers: [
    UserRepository,
    TokenService,
    RevokedTokensRepository,
    JwtService,
    
  ],
  exports: [
    UserModel,
    RevokedTokensModel,
    UserRepository,
    TokenService,
    RevokedTokensRepository,
    JwtService,
  ],
})
export class GlobalModule {}

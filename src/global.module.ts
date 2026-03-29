import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/Common/Services';
import { RevokedTokensModel, UserModel } from 'src/DB/Models';
import { RevokedTokensRepository, UserRepository } from 'src/DB/Repositories';
import { EventsModule } from './Common/Gatways/gateway.module';
@Global()
@Module({
  imports: [UserModel, RevokedTokensModel],
  controllers: [],
  providers: [
    UserRepository,
    TokenService,
    RevokedTokensRepository,
    JwtService,
    EventsModule
  ],
  exports: [
    UserModel,
    RevokedTokensModel,
    UserRepository,
    TokenService,
    RevokedTokensRepository,
    JwtService,
    EventsModule
  ],
})
export class GlobalModule {}

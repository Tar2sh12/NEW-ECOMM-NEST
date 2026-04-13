import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/Common/Services';
import { RevokedTokensModel, UserModel } from 'src/DB/Models';
import { RevokedTokensRepository, UserRepository } from 'src/DB/Repositories';
import { EventsModule } from './Common/Gatways/gateway.module';
import { RealTimeEventsGateway } from './Common/Gatways/gateways';
@Global()
@Module({
  imports: [UserModel, RevokedTokensModel],
  controllers: [],
  providers: [
    UserRepository,
    TokenService,
    RevokedTokensRepository,
    JwtService,
    EventsModule,
    RealTimeEventsGateway
  ],
  exports: [
    UserModel,
    RevokedTokensModel,
    UserRepository,
    TokenService,
    RevokedTokensRepository,
    JwtService,
    EventsModule
    ,RealTimeEventsGateway
  ],
})
export class GlobalModule {}

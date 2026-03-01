import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule,CategoryModule } from './Modules';
import { GlobalModule } from './global.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    CategoryModule,
    GlobalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

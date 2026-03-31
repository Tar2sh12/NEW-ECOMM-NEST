import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule,CategoryModule ,ProductModule,SubCategoryModule,BrandModule, CartModule,AddressModule,CouponModule} from './Modules';
import { GlobalModule } from './global.module';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { EventsModule } from './Common/Gatways/gateways';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      connectionFactory: (connection) => {
        connection.plugin(aggregatePaginate);
        return connection;
      },
    }),
    AuthModule,
    GlobalModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    CartModule,
    EventsModule,
    AddressModule,
    CouponModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

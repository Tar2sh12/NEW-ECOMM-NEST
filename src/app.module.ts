import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule,CategoryModule ,ProductModule,SubCategoryModule,BrandModule} from './Modules';
import { GlobalModule } from './global.module';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
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
    CategoryModule,
    SubCategoryModule,
    GlobalModule,
    ProductModule,
    BrandModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

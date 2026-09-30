import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthModule,
  CategoryModule,
  ProductModule,
  SubCategoryModule,
  BrandModule,
  CartModule,
  AddressModule,
  CouponModule,
  OrderModule,
} from './Modules';
import { GlobalModule } from './global.module';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { EventsModule } from './Common/Gatways/gateways';
import { CoreModule } from './Core/core.module';

// graphql imports
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GQLModule } from './GraphQl/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      connectionFactory: (connection) => {
        connection.plugin(aggregatePaginate);
        connection.plugin(mongoosePaginate);
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
    CouponModule,
    OrderModule,
    CoreModule,
    // GraphQL module configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/Schema.gql',
    }),
    GQLModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

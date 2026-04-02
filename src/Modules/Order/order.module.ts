import { Module } from '@nestjs/common';
import { OrderService } from './Services/order.service';
import { OrderController } from './Controller/order.controller';
import { AddressModel, CartModel, CouponModel, OrderModel, ProductModel } from 'src/DB/Models';
import { AddressRepository, CartRepository, CouponRepository, OrderRepository, ProductRepository } from 'src/DB/Repositories';
import { CloudUploadFilesService } from 'src/Common/Services';

@Module({
  imports:[OrderModel,CartModel,CouponModel,AddressModel,ProductModel],
  controllers: [OrderController],
  providers: [OrderService,OrderRepository,CartRepository,CouponRepository,AddressRepository,ProductRepository , CloudUploadFilesService],
})
export class OrderModule {}

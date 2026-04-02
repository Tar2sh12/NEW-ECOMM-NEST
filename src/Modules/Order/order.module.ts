import { Module } from '@nestjs/common';
import { OrderService } from './Services/order.service';
import { OrderController } from './Controller/order.controller';
import { AddressModel, CartModel, CouponModel, OrderModel } from 'src/DB/Models';
import { AddressRepository, CartRepository, CouponRepository, OrderRepository } from 'src/DB/Repositories';

@Module({
  imports:[OrderModel,CartModel,CouponModel,AddressModel],
  controllers: [OrderController],
  providers: [OrderService,OrderRepository,CartRepository,CouponRepository,AddressRepository],
})
export class OrderModule {}

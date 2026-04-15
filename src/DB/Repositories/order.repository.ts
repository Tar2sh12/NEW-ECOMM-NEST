import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import {  Order, OrderType } from '../Models';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepository extends BaseService<OrderType> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderType>,
  ) {
    super(orderModel);
  }
    async calculateTotalPrice(order:OrderType): Promise<number> {
      let subTotal =0;
      //console.log(cart.products);
      
      subTotal= order.products.reduce((total, product) => {
        return total + (product.finalPrice * product.quantity);
      }, 0);
      //console.log(subTotal);
      
      return subTotal;
    }
}

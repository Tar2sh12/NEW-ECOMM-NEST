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
}

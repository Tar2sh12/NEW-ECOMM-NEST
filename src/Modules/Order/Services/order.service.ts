import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { AddressRepository, CartRepository, CouponRepository, OrderRepository } from 'src/DB/Repositories';

@Injectable()
export class OrderService {
  constructor (private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly couponRepository: CouponRepository,
    private readonly addressRepository: AddressRepository
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

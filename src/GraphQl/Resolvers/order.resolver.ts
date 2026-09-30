import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from 'src/Modules/Order/Services/order.service';
import { OrderObjectType } from '../Types/order.types';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => String, {
    name: 'OrderRootQueryResolver',
    description: 'Root query for order module',
  })
  rootQuery(): string {
    return 'Order module root query';
  }

  @Query(() => [OrderObjectType], {name : 'getAllOrders', description: 'Get all orders'})
  async getAllOrders(): Promise<any[]> {
    return await this.orderService.getOrdersService();
  }
}

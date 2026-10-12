import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from 'src/Modules/Order/Services/order.service';
import { OrderFilterDto, OrderObjectType } from '../Types/order.types';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/Common/Guards';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { User } from 'src/Common/Decorators/User-data.custom.decorator';


@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
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
  @Auth([SystemRoles.USER])
  async getAllOrders(
    @Args('getOrderFilter') orderFilter: OrderFilterDto,
    @User() user: IAuthUser,
  ): Promise<OrderObjectType[]> {
    return await this.orderService.getOrdersService(orderFilter,user);
  }
}

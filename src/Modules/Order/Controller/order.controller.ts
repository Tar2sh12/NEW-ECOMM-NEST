import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrderService } from '../Services/order.service';
import { CreateOrderDto, GetMyOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Auth } from 'src/Common/Guards';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { User } from 'src/Common/Decorators';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Auth([SystemRoles.USER])
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @User() user: IAuthUser,
  ) {
    return await this.orderService.create(createOrderDto, user);
  }

  @Get('get-my-order')
  @Auth([SystemRoles.USER])
  getMyOrder(@User() user: IAuthUser, @Body() getMyOrderDto: GetMyOrderDto) {
    return this.orderService.getMyOrder(getMyOrderDto.orderId, user);
  }

  @Post('pay-with-stripe/:orderId')
  @Auth([SystemRoles.USER])
  async payWithStripe(
    @Param('orderId') orderId: Types.ObjectId,
    @User() user: IAuthUser,
  ) {
    return await this.orderService.payWithStripe(orderId, user);
  }

  @Post('webhook')
  async stripeWebhook(@Body() data: any) {
    await this.orderService.stripeWebhookHandler(data);
  }

  @Put('cancel-order/:orderId')
  @Auth([SystemRoles.USER])
  async cancelOrder(
    @Param('orderId') orderId: Types.ObjectId,
    @User() user: IAuthUser,
  ) {
    return await this.orderService.cancelOrderService(orderId, user);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Headers,
  HttpCode,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { OrderService } from '../Services/order.service';
import { CreateOrderDto, GetMyOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Auth } from 'src/Common/Guards';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { User } from 'src/Common/Decorators';
import { Types } from 'mongoose';
import { PaymobRedirectQuery, PaymobService } from '../Payment/Services';



@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly paymobService: PaymobService) {}

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

  @Post('pay-with-paymob/:orderId')
  @Auth([SystemRoles.USER])
  async payWithPaymob(
    @Param('orderId') orderId: Types.ObjectId,
    @User() user: IAuthUser,
  ) {
    return await this.orderService.createPaymobOrder(user, orderId);
  }

@Get('webhook-paymob')
@HttpCode(200)
async handleWebhook(@Query() query: PaymobRedirectQuery) {
  // 1. Verify HMAC first — reject if tampered


  

  const {validHmac, success, pending, order, body} = this.paymobService.verifyHmac(query);
  if (!validHmac) throw new UnauthorizedException('Invalid HMAC');
  let result = null;
  // 3. Act on result
  if (success && !pending) {
    console.log(`Payment successful for order ${order.merchant_order_id}`);
    console.log(`Paymob transaction ID: ${body.obj.id}`);
    //orderid
    console.log(`Paymob order ID: ${order.id}`);
    result = await this.orderService.paymobWebhookHandler( order.merchant_order_id, body.obj.id.toString(),  order.id.toString());
  } else {
    console.log(`Payment failed or pending for order ${order.merchant_order_id}`);
  }

  // 4. Redirect user to frontend result page
  return { success, merchantOrderId: order.merchant_order_id ,result};
}
}

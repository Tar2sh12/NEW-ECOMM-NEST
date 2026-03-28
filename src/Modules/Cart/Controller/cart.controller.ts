import { Body, Controller, Get, Param, Patch, Post, Put, Res, UseInterceptors } from '@nestjs/common';
import { CartService } from '../Services/cart.service';
import { User } from 'src/Common/Decorators/User-data.custom.decorator';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { Auth } from 'src/Common/Guards';
import { AddToCartDto } from '../dto/addToCart.dto';
import { ResponseInterceptor } from 'src/Interceptors';
import { Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @Auth([SystemRoles.USER])
  async addToCart(
    @User() loggedInUser: IAuthUser,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const result = await this.cartService.addToCart(loggedInUser, addToCartDto);
    return result;
  }

  @Patch('remove-from-cart/:productId')
  @Auth([SystemRoles.USER])
  async removeFromCart(
    @User() loggedInUser: IAuthUser,
    @Param('productId') productId: string,
  ) {
    const result = await this.cartService.removeFromCart(
      loggedInUser,
      productId,
    );
    return result;
  }

  @Put('update-product-quantity/:productId')
  @Auth([SystemRoles.USER])
  async updateProductQuantity(
    @User() loggedInUser: IAuthUser,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    const result = await this.cartService.updateProductQuantity(
      loggedInUser,
      productId,
      quantity,
    );
    return result;
  }


   @Get('get-my-cart')
  @Auth([SystemRoles.USER])
  @UseInterceptors(new ResponseInterceptor('Cart fetched successfully'))
  async getMyCart(
    @User() loggedInUser: IAuthUser,
  ) {
    const result = await this.cartService.getMyCart(loggedInUser);
    return result;
  }
}


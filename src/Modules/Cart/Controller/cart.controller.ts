import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from '../Services/cart.service';
import { User } from 'src/Common/Decorators/User-data.custom.decorator';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { Auth } from 'src/Common/Guards';
import { AddToCartDto } from '../dto/addToCart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @Auth([SystemRoles.ADMIN])
  addToCart(
    @User() loggedInUser: IAuthUser,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(loggedInUser, addToCartDto);
  }
}

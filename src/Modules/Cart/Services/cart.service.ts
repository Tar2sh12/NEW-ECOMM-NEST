import { Injectable } from '@nestjs/common';
import { CartRepository } from 'src/DB/Repositories';
import { AddToCartDto } from '../dto/addToCart.dto';
import { IAuthUser } from 'src/Common/Types';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  addToCart(loggedInUser: IAuthUser, addToCartDto: AddToCartDto) {}
}

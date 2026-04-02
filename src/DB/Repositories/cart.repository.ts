import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { Cart, CartType } from '../Models';
import { Model } from 'mongoose';

@Injectable()
export class CartRepository extends BaseService<CartType> {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartType>,
  ) {
    super(cartModel);
  }

  async calculateTotalPrice(cartId: string): Promise<number> {
    const cart = await this.cartModel.findById(cartId).populate('products.productId');
    if (!cart) throw new BadRequestException('Cart not found');
    let subTotal =0;
    subTotal= cart.products.reduce((total, product) => {
      return total + (product.productId['price'] * product.productId['quantity']);
    }, 0);
    return subTotal;
  }


}

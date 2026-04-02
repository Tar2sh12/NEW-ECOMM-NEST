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

  async calculateTotalPrice(cart:CartType): Promise<number> {
    let subTotal =0;
    //console.log(cart.products);
    
    subTotal= cart.products.reduce((total, product) => {
      return total + (product.finalPrice * product.quantity);
    }, 0);
    //console.log(subTotal);
    
    return subTotal;
  }


}

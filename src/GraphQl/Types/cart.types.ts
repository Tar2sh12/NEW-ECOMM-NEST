import {
  Field,
  ObjectType,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { CartType } from 'src/DB/Models';
import { Types } from 'mongoose';

/**
 * 
 * products: {
    productId: Types.ObjectId;
    quantity: number;
    finalPrice: number;
  }[];
 */

@ObjectType()
export class CartProductsObjectType {
    @Field(() => ID, { nullable: false })
    productId: Types.ObjectId;

    @Field(() => Float, { nullable: false })
    quantity: number;

    @Field(() => Float, { nullable: false })
    finalPrice: number;
}

@ObjectType()
export class CartObjectType implements Partial<CartType> {
  @Field(() => ID, { nullable: false })
  _id: Types.ObjectId;

  @Field(() => [CartProductsObjectType], { nullable: false })
  products: CartProductsObjectType[];

  @Field(() => Float, { nullable: false })
  subTotal: number;
}

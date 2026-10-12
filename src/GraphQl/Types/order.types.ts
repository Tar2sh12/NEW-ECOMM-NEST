import { Field, ObjectType, ID, Float  ,registerEnumType, InputType} from '@nestjs/graphql';
import { OrderType } from 'src/DB/Models';
import { Types } from 'mongoose';
import { OrderStatus, paymentMethods } from 'src/Common/Types/enums';
import { CartObjectType } from './cart.types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

registerEnumType(OrderStatus, {
  name: 'OrderStatusEnum',
  description: 'The status of the order',
});

registerEnumType(paymentMethods, {
  name: 'PaymentMethodsEnum',
  description: 'The payment method of the order',
});

@ObjectType()
export class OrderObjectType implements Partial<OrderType> {
  @Field(() => ID, { nullable: false })
  _id: Types.ObjectId;

  //Numbers
  @Field(() => Float, { nullable: false })
  subTotal: number;
  @Field(() => Float, { nullable: false })
  shipingFee: number;
  @Field(() => Float, { nullable: false })
  VAT: number;
  @Field(() => Float, { nullable: false })
  total: number;

  //Dates
  deliveredAt: Date;

  cancelledAt: Date;

  estimatedDeliveryDate: Date;

  //Enums
  @Field(() => paymentMethods, { nullable: false })
  paymentMethod: paymentMethods;
  
  @Field(() => OrderStatus, { nullable: false })
  orderStatus: OrderStatus;

  //IDs
  @Field(() => ID, { nullable: true })
  deliveredBy: Types.ObjectId;
  @Field(() => ID, { nullable: true })
  cancelledBy: Types.ObjectId;
  @Field(() => ID, { nullable: true })
  refundBy: Types.ObjectId;
  @Field(() => ID, { nullable: false })
  addressId: Types.ObjectId;
  @Field(() => ID, { nullable: false })
  couponId: Types.ObjectId;
  @Field(() => ID, { nullable: false })
  userId: Types.ObjectId;

  

  //Arrays
  products: {
    productId: Types.ObjectId;
    quantity: number;
    finalPrice: number;
  }[];

  //Strings
  @Field(() => String, { nullable: true })
  payment_intent: String;

  @Field(() => String, { nullable: false })
  contactNumber: string;

  @Field(() => String, { nullable: true })
  paymobTransactionId: string;

  @Field(() => String, { nullable: true })
  paymobOrderId: string;






  @Field(() => CartObjectType, { nullable: false })
  cartId; 
}


@InputType()
export class OrderFilterDto{
  @Field(() => OrderStatus, { nullable: true })
  @IsString()
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  orderStatus?: OrderStatus;

}
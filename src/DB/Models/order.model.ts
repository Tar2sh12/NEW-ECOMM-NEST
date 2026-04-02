import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { Coupon } from './coupon.model';
import { Address } from './address.model';
import { User } from './user.model';
import { OrderStatus, paymentMethods } from 'src/Common/Types';
import { Product } from './product.model';
import { Cart } from './cart.model';

@Schema({ timestamps: true })
export class Order {


  //Numbers  
  @Prop({ type: Number, required: true })
  subTotal: number;

  @Prop({ type: Number, required: true })
  shippingFee: number;

  @Prop({ type: Number, required: true })
  VAT: number;

  @Prop({ type: Number, required: true })
  total: number;

  //Dates
  @Prop({ type: Date })
  deliveredAt: Date;

  @Prop({ type: Date })
  cancelledAt: Date;

  @Prop({ type: Date, required: true, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }) // default to 7 days from now
  estimatedDeliveryDate: Date;


  //Enums
  @Prop({ type: String, enum: paymentMethods, required: true })
  paymentMethod: paymentMethods;

  @Prop({ type: String, enum: OrderStatus, required: true })
  orderStatus: OrderStatus;

  //Strings
  @Prop({ type: String })
  payment_intent: String;

    @Prop({ type: String, required: true })
  contactNumber: string;

  //IDs
  @Prop({ type: Types.ObjectId, ref: User.name })
  deliveredBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  cancelledBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  refundBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Address.name, required: true })
  addressId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Coupon.name, required: true })
  couponId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Cart.name, required: true })
  cartId: Types.ObjectId;


  //Arrays
  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: Product.name },
        quantity: Number,
        price: Number,
      },
    ],
  })
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
}



const orderSchema = SchemaFactory.createForClass(Order);



export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]);

export type OrderType= HydratedDocument<Order> & Document;
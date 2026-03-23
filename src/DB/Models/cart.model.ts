import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, HydratedDocument } from 'mongoose';
import { Product, User } from '.';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: Product.name },
        quantity: Number,
        finalPrice: Number,
      },
    ],
  })
  products: {
    productId: Types.ObjectId;
    quantity: number;
    finalPrice: number;
  }[];

  @Prop({ type: Number })
  subTotal: number;
}

const cartSchema = SchemaFactory.createForClass(Cart);

cartSchema.pre('save', async function () { // this save hook works with both create and save operations 
  this.subTotal = this.products.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
});

export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]);

export type CartType= HydratedDocument<Cart> & Document;

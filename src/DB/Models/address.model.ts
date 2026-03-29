import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: Number, required: true })
  postalCode: number;

  @Prop({ type: String, required: true })
  buildingNumber: string;

  @Prop({ type: Number, required: true })
  floorNumber: number;

  @Prop({ type: String })
  addressLabel: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: Boolean, default: false })
  isMarkedAsDeleted: boolean;
}

export const addressSchema = SchemaFactory.createForClass(Address);

export const AddressModel = MongooseModule.forFeature([
  { name: Address.name, schema: addressSchema },
]);
export type AddressType = HydratedDocument<Address> & Document;

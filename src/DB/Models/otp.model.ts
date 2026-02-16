import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from './user.model';
import { OTPTypes } from 'src/Common/Types';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: String, required: true })
  otp: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: string | Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
  })
  expireTime: Date;

  @Prop({
    type: String,
    required: true,
    enum:OTPTypes
  })
  otpType: OTPTypes;
}
//creating the actual mongoose schema
const otpSchema = SchemaFactory.createForClass(Otp);
//creating the model
export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
//type for the user document used for some restrictions
export type OtpType = HydratedDocument<Otp> & Document; //& Document used to add the fields like _id , __v, createdAt and updatedAt

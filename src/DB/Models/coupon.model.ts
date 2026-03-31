import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { CouponTypes } from 'src/Common/Types';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: String, required: true,unique:true })
  couponCode: string;

    @Prop({ type: Number, required: true })
    couponAmount: number;

    @Prop({ type: String, enum:CouponTypes,required: true })
    couponType: CouponTypes;

    @Prop({ type: Date, required: true })
    from: Date;

    @Prop({ type: Date, required: true })
    till: Date;

    @Prop({ type: [
        {
            userId: { type: Types.ObjectId, ref: User.name },
            maxCount: { type: Number, required: true ,min:1},
            usageCount: { type: Number, default: 0 },
        }
    ] })
    Users:{
        userId:Types.ObjectId,
        maxCount: number,

    }[];

    @Prop({ type: Boolean, default: false })
    isEnable: boolean;

    @Prop({type:Types.ObjectId,ref:User.name})
    createdBy: Types.ObjectId;
}



const couponSchema = SchemaFactory.createForClass(Coupon);



export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: couponSchema }]);

export type CouponType= HydratedDocument<Coupon> & Document;
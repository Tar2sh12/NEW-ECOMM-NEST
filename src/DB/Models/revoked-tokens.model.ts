import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class RevokedTokens {
  @Prop({ type: String, required: true })
  tokenId: string;

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
}
//creating the actual mongoose schema
const revokedTokensSchema = SchemaFactory.createForClass(RevokedTokens);
//creating the model
export const RevokedTokensModel = MongooseModule.forFeature([
  { name: RevokedTokens.name, schema: revokedTokensSchema },
]);
//type for the user document used for some restrictions
export type RevokedTokensType = HydratedDocument<RevokedTokens> & Document; //& Document used to add the fields like _id , __v, createdAt and updatedAt

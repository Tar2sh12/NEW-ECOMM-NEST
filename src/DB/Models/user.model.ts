import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { GenderEnum, SystemRoles } from 'src/Common/Types';
import { Hash, encrypt } from 'src/Common/Security';
@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    type: String,
    //unique: true,
    index: { name: 'email_unique_idx', unique: true },
  })
  email: string;
  @Prop({
    required: true,
    type: Number,
  })
  age: number;
  @Prop({
    required: true,
    type: String,
  })
  password: string;
  @Prop({
    required: true,
    type: String,
    enum: SystemRoles,
    default: SystemRoles.USER,
  })
  role: SystemRoles;

  @Prop({
    required: true,
    type: String,
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  phone: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    type: Date,
  })
  DOB: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}

//creating the actual mongoose schema
const userSchema = SchemaFactory.createForClass(User);
userSchema.pre('save', function () {
  const changes = this.getChanges()['$set'];
  if (changes && changes.password) {
    this.password = Hash(changes.password, +process.env.SALT_ROUNDS);
  }
  if (changes && changes.phone) {
    this.phone = encrypt(changes.phone, process.env.SECRET_ENCRYPTION_KEY);
  }
});
//creating the model
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
//type for the user document used for some restrictions
export type UserType = HydratedDocument<User> & Document;

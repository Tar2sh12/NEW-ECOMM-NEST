import { MongooseModule, Prop, Schema,SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SystemRoles } from 'src/Common/Types';
import { Hash } from 'src/Security';
@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  username: string;
  @Prop({
    required: true,
    type: String,
    unique: true,
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
}

//creating the actual mongoose schema
const userSchema = SchemaFactory.createForClass(User);
userSchema.pre('save', function () {
  const changes = this.getChanges()['$set'];
  if (changes && changes.password) {
    this.password = Hash(changes.password, +process.env.SALT_ROUNDS);
  }
})
//creating the model 
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: userSchema }]);
//type for the user document used for some restrictions
export type UserType = HydratedDocument<User>;
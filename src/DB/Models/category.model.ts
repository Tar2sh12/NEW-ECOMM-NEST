import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from './user.model';
import slugify from 'slugify';

@Schema()
export class Category {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'category_unique_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name);
    },
    lowercase: true,
    index: { name: 'category_slug_idx', unique: true },
    trim: true,
  })
  slug: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  addedBy: Types.ObjectId;

  @Prop({ type: Object })
  image: object;

  @Prop({type : String })
  folderId: string;


  //updatedBy
  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;
}

//creating the actual mongoose schema
const CategorySchema = SchemaFactory.createForClass(Category);

export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);

export type CategoryType = HydratedDocument<Category> & Document;

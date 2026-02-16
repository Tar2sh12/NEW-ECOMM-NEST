import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from './user.model';
import slugify from 'slugify';
import { Category } from './category.model';

@Schema()
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'sub_category_unique_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name);
    },
    lowercase: true,
    index: { name: 'sub_category_slug_idx', unique: true },
    trim: true,
  })
  slug: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  addedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  categoryId: Types.ObjectId | string;

  @Prop({ type: Object })
  image: object;
}

//creating the actual mongoose schema
const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

export const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);

export type SubCategoryType = HydratedDocument<SubCategory> & Document;

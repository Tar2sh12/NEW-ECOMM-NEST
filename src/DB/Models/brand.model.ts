import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';
import { SubCategory } from './sub-category.model';

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'brand_unique_idx', unique: true },
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name);
    },
    lowercase: true,
    index: { name: 'brand_slug_idx', unique: true },
    trim: true,
  })
  slug: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  brandOwner: Types.ObjectId | string;

  @Prop({ type: String })
  folderId: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  //categoryId, subcategoryId
  @Prop({ type: Types.ObjectId, ref: Category.name })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name })
  subcategoryId: Types.ObjectId;

  @Prop({ type: Object })
  logo: object;

  @Prop({ type: Boolean })
  isDeleted: boolean;
}

const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);

export type BrandType = HydratedDocument<Brand> & Document;

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';
import { DiscountType } from 'src/Common/Types';
import { SubCategory } from './sub-category.model';
import { Brand } from './brand.model';
export interface IProductImage {
  public_id: string;
  secure_url: string;
}
@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'product_unique_idx' },
  })
  title: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    index: { name: 'product_slug_idx' },
    default: function () {
      return slugify(this.title);
    },
  })
  slug: string;

  @Prop({
    type: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    default: [],
  })
  images: IProductImage[];

  @Prop({ type: String })
  folderId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  addedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  categoryId: Types.ObjectId;

  //subcategoryId and brandId
  @Prop({ type: Types.ObjectId, ref: SubCategory.name })
  subcategoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brandId: Types.ObjectId;

  //! (don't forget) adding the reference fields for subcategory and brand when they are created

  //? (numbers) basePrice , discount , finalPrice , stock , overAllRating
  @Prop({ type: Number, required: true })
  basePrice: number;

  @Prop({ type: Number })
  discount: number;

  @Prop({
    type: String,
    enum: Object.values(DiscountType),
    default: DiscountType.PERCENTAGE,
  })
  discountType: string;

  @Prop({
    type: Number,
    default: function () {
      if (this.discountType === DiscountType.PERCENTAGE) {
        return this.basePrice - (this.basePrice * (this.discount || 0)) / 100;
      } else if (this.discountType === DiscountType.AMOUNT) {
        return this.basePrice - (this.discount || 0);
      }
    },
  })
  finalPrice: number;

  @Prop({ type: Number, required: true, min: 1 })
  stock: number;

  @Prop({ type: Number, default: 0 })
  overAllRating: number;
}

//creating the actual mongoose schema
const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);

export type ProductType = HydratedDocument<Product> & Document;

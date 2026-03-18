import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { Product, ProductType } from '../Models';
import { Model } from 'mongoose';
import { CloudUploadFilesService } from 'src/Common/Services';

@Injectable()
export class ProductRepository extends BaseService<ProductType> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductType>,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
  ) {
    super(productModel);
  }

  async deleteProductById(id: string): Promise<ProductType> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).populate('categoryId').populate('subcategoryId').populate('brandId');
    if (!deletedProduct) throw new NotFoundException('Product not found');
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      await this.cloudUploadFilesService.deleteFolderByFolderPrefix(
        `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${deletedProduct.categoryId['folderId']}/SubCategories/${deletedProduct.subcategoryId['folderId']}/Brands/${deletedProduct.brandId['folderId']}/Products/${deletedProduct.folderId}`
      );
    }
    return deletedProduct;
  }
}
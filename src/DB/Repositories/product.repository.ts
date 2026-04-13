import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { CartType, Product, ProductType } from '../Models';
import { Model } from 'mongoose';
import { CloudUploadFilesService } from 'src/Common/Services';
import { RealTimeEventsGateway } from 'src/Common/Gatways/gateways';

@Injectable()
export class ProductRepository extends BaseService<ProductType> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductType>,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
    private readonly RealTimeEventsGateway: RealTimeEventsGateway,
  ) {
    super(productModel);
  }

  async deleteProductById(id: string): Promise<ProductType> {
    const deletedProduct = await this.productModel
      .findByIdAndDelete(id)
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('brandId');
    if (!deletedProduct) throw new NotFoundException('Product not found');
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      await this.cloudUploadFilesService.deleteFolderByFolderPrefix(
        `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${deletedProduct.categoryId['folderId']}/SubCategories/${deletedProduct.subcategoryId['folderId']}/Brands/${deletedProduct.brandId['folderId']}/Products/${deletedProduct.folderId}`,
      );
    }
    return deletedProduct;
  }

  async decrementStock(cart: CartType) {
    // decrement product stock
    for (const item of cart.products) {
      const product = item.productId;
      const p = await this.findOne({
        filters: { _id: product._id },
      });
      if (!p) {
        throw new BadRequestException(
          `Product with id ${product._id} not found`,
        );
      }
      if (p.stock < item.quantity) {
        throw new BadRequestException(`Product ${p.title} is out of stock`);
      }
      p.stock -= item.quantity;
      await this.save(p);
      this.RealTimeEventsGateway.emitStockUpdates(p._id, p.stock);
    }
  }
}

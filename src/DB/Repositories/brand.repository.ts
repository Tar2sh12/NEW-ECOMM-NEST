import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { Brand, BrandType } from '../Models';
import { Model } from 'mongoose';
import { ProductRepository } from './product.repository';
import { CloudUploadFilesService } from 'src/Common/Services';

@Injectable()
export class BrandRepository extends BaseService<BrandType> {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandType>,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
    private readonly productRepository: ProductRepository
  ) {
    super(brandModel);
  }

  async deleteBrandById(id: string): Promise<BrandType> {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id).populate('categoryId').populate('subcategoryId');
    if (!deletedBrand) throw new NotFoundException('Brand not found');
    const products = await this.productRepository.deleteMany({
      filters: { brandId: deletedBrand._id },
    });

    if (deletedBrand.logo) {
      await this.cloudUploadFilesService.deleteFolderByFolderPrefix(
        `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${deletedBrand.categoryId['folderId']}/SubCategories/${deletedBrand.subcategoryId['folderId']}/Brands/${deletedBrand.folderId}`,
      );
    }

    return deletedBrand;
  }
}

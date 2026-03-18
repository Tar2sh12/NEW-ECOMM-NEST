import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { SubCategory, SubCategoryType } from '../Models';
import { Model } from 'mongoose';
import { BrandRepository } from './brand.repository';
import { ProductRepository } from './product.repository';
import { CloudUploadFilesService } from 'src/Common/Services';

@Injectable()
export class SubCategoryRepository extends BaseService<SubCategoryType> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryType>,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
    private readonly brandRepository: BrandRepository,
    private readonly productRepository: ProductRepository,
  ) {
    super(subCategoryModel);
  }

  async deleteSubCategoryById(id: string): Promise<SubCategoryType> {
    const deletedSubCategory = await this.subCategoryModel
      .findByIdAndDelete({
        _id: id,
      })
      .populate('categoryId');
    if (!deletedSubCategory)
      throw new NotFoundException('SubCategory not found');
    const brands = await this.brandRepository.deleteMany({
      filters: { subcategoryId: deletedSubCategory._id },
    });
    const products = await this.productRepository.deleteMany({
      filters: { subcategoryId: deletedSubCategory._id },
    });
    if (deletedSubCategory.image) {
      await this.cloudUploadFilesService.deleteFolderByFolderPrefix(
        `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${deletedSubCategory.categoryId['folderId']}/SubCategories/${deletedSubCategory.folderId}`,
      );
    }
    return deletedSubCategory;
  }
}

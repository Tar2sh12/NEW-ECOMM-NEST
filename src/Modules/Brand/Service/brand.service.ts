import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { IAuthUser } from 'src/Common/Types';
import {
  CategoryRepository,
  SubCategoryRepository,
  BrandRepository,
} from 'src/DB/Repositories';
import { nanoid } from 'nanoid';
import { CloudUploadFilesService } from 'src/Common/Services';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    loggedInUser: IAuthUser,
    logo?: Express.Multer.File,
  ) {
    const { name, categoryId, subcategoryId } = createBrandDto;
    //check if the brand name already exists
    const brandNameExists = await this.brandRepository.findOne({
      filters: { name },
    });
    if (brandNameExists) {
      throw new ConflictException('Brand name already exists');
    }

    //check if the category exists
    const categoryExists = await this.categoryRepository.findOne({
      filters: { _id: categoryId },
    });
    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    //check if the subcategory exists
    const subCategoryExists = await this.subCategoryRepository.findOne({
      filters: { _id: subcategoryId },
    });
    if (!subCategoryExists) {
      throw new NotFoundException('Subcategory not found');
    }

    const brand = {
      name,
      categoryId: categoryExists._id,
      subcategoryId: subCategoryExists._id,
      brandOwner: loggedInUser.user._id,
    };

    if (logo) {
      //create a unique folder in cloudinary for each category using nanoid
      const folderId = nanoid(4);
      //upload the image to cloudinary
      const logoResult = await this.cloudUploadFilesService.uploadFile(
        logo.path,
        {
          folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${categoryExists.folderId}/SubCategories/${subCategoryExists.folderId}/Brands/${folderId}`,
        },
      );
      brand['logo'] = {
        secure_url: logoResult.secure_url,
        public_id: logoResult.public_id,
      };
      brand['folderId'] = folderId;
    }
    const result = await this.brandRepository.create(brand);
    return result;
  }

  async findAll(query : any) {
    const result = await this.brandRepository.findByAggregate([], query);
    return result;
  }

  async getBrandById(id: string) {
    return await this.brandRepository.findOne({
      filters: { _id: id },
      populateArray: [
        { path: 'categoryId', select: '_id name folderId' },
        { path: 'subcategoryId', select: '_id name folderId' },
      ],
    });
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  async deleteBrandById(id: string) {
    return await this.brandRepository.deleteBrandById(id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IAuthUser } from 'src/Common/Types';
import { ProductRepository } from 'src/DB/Repositories/product.repository';
import { CloudUploadFilesService } from 'src/Common/Services';
import { CategoryService } from 'src/Modules/Category/Services/category.service';
import { nanoid } from 'nanoid';
import { BrandRepository, SubCategoryRepository } from 'src/DB/Repositories';
import { RealTimeEventsGateway } from 'src/Common/Gatways/gateways';

export interface CreateProductServiceParams {
  createProductDto: CreateProductDto;
  authUser: IAuthUser;
  images: Express.Multer.File[];
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
    private readonly categoryService: CategoryService,
    private readonly subcategoryRepository: SubCategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly realTimeEventsGateway:RealTimeEventsGateway
  ) {}

  async create({
    createProductDto,
    authUser,
    images,
  }: CreateProductServiceParams) {
    const addedBy = authUser.user._id;
    const {
      title,
      description,
      basePrice,
      discount,
      stock,
      categoryId,
      subcategoryId,
      brandId,
    } = createProductDto;

    //check if the category exists
    const category = await this.categoryService.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const isSubcategoryExists = await this.subcategoryRepository.findOne({
      filters: { _id: subcategoryId },
    });
    if (!isSubcategoryExists) {
      throw new NotFoundException('Subcategory not found');
    }

    const isBrandExists = await this.brandRepository.findOne({
      filters: { _id: brandId },
    });
    if (!isBrandExists) {
      throw new NotFoundException('Brand not found');
    }

    const productObject = {
      title,
      description,
      basePrice,
      discount,
      stock,
      categoryId: category._id,
      subcategoryId: isSubcategoryExists._id,
      brandId: isBrandExists._id,
      addedBy,
    };

    if (!images?.length)
      throw new BadRequestException('At least one product image is required');

    const folderId = nanoid(4);
    const folderUrl = `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${category.folderId}/SubCategories/${isSubcategoryExists.folderId}/Brands/${isBrandExists.folderId}/Products/${folderId}`;
    const paths = images.map((image) => image.path);
    productObject['images'] = await this.cloudUploadFilesService.uploadFiles(
      paths,
      {
        folder: folderUrl,
      },
    );

    productObject['folderId'] = folderId;

    //console.log(productObject);
    const product =  await this.productRepository.create(productObject);
    this.realTimeEventsGateway.emitNewProduct(product);
    return product;
  }

  async findAll(query: any) {
    const result = await this.productRepository.findByAggregate([], query);
    return result;
  }

  async findOne(id: string) {
    return await this.productRepository.findOne({
      filters: { _id: id },
      populateArray: [
        { path: 'categoryId', select: '_id name folderId' },
        { path: 'subcategoryId', select: '_id name folderId' },
        { path: 'brandId', select: '_id name folderId' },
      ],
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async deleteProductById(id: string) {
    const result = await this.productRepository.deleteProductById(id);
    return result;
  }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "./base.service";
import { Product,ProductType } from "../Models";
import { Model } from "mongoose";

@Injectable()
export class ProductRepository extends BaseService<ProductType> {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductType>) {
        super(productModel);
    }
}
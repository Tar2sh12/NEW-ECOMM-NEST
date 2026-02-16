import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "./base.service";
import { Category,CategoryType } from "../Models";
import { Model } from "mongoose";

@Injectable()
export class CategoryRepository extends BaseService<CategoryType> {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryType>) {
        super(categoryModel);
    }
}
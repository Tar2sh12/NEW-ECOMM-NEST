import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "./base.service";
import { User,UserType } from "../Models";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends BaseService<UserType> {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserType>) {
        super(userModel);
    }
    async findByEmail(email: string): Promise<UserType | null> {
        return await this.findOne({ filters: { email } });
    }
}
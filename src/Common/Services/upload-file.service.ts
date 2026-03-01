import { Injectable } from "@nestjs/common";
import { CloudinaryConfig } from "../Config/";
import { UploadApiOptions } from "cloudinary";


@Injectable()
export class CloudUploadFilesService {

    private cloudinary = CloudinaryConfig()


    async uploadFile(file: string, options: UploadApiOptions) {
        const data = await this.cloudinary.uploader.upload(file, options)
        return { secure_url: data.secure_url, public_id: data.public_id }
    }

    async uploadFiles(files: string[], options: UploadApiOptions) {
        const ImagesArr: object[] = []

        for (const path of files) {
            const data = await this.uploadFile(path, options)
            ImagesArr.push({ secure_url: data.secure_url, public_id: data.public_id })
        }
        return ImagesArr
    }

    async deleteFileByPublicId(public_id: string) {
        await this.cloudinary.uploader.destroy(public_id)
    }

    async deleteFolderByFolderPrefix(prefix: string) {
        await this.cloudinary.api.delete_resources_by_prefix(prefix)
        await this.cloudinary.api.delete_folder(prefix)
    }
}
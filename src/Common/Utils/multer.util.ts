import { BadRequestException } from '@nestjs/common';
import { Request, Express } from 'express';
import { diskStorage } from 'multer';
import { DateTime } from "luxon";
import { nanoid } from "nanoid";

interface MulterOptions {
  path?: string;
  allowedFileTypes: string[];
  maxFileSize?: number;
}

export const UploadFileOptions = ({
  path = 'General',
  allowedFileTypes,
  maxFileSize,
}: MulterOptions) => {
  const storage = diskStorage({});

  //in case of storing the file locally in our server 
//   const storage = diskStorage({
//     destination: `./Uploads/${path}`,
//     filename: (req, file, cb) => {
//       // 2026-12-1
//       const now = DateTime.now().toFormat("yyyy-MM-dd");
//       // generate a unique string
//       const uniqueString = nanoid(4);
//       // generate a unique file name
//       const uniqueFileName = `${now}_${uniqueString}_${file.originalname}`;
//       cb(null, uniqueFileName);
//     },
//   });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: Function,
  ) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(`Unsupported file type ${file.mimetype}`),
        false,
      );
    }
  };

  return {
    fileFilter,
    storage,
  };
};

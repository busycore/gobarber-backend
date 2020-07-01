import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

const tmpFolders = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: { storage: StorageEngine };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder: tmpFolders,
  uploadsFolder: path.resolve(tmpFolders, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolders,
      filename(request, file, callback) {
        const filehash = crypto.randomBytes(10).toString('HEX');
        const filename = `${filehash}-${file.originalname}`;
        return callback(null, filename);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber-busycore',
    },
  },
} as IUploadConfig;

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

const tmpFolders = path.resolve(__dirname, '..', '..', 'tmp');
export default {
  tmpFolder: tmpFolders,
  uploadsFolder: path.resolve(tmpFolders, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolders,
    filename(request, file, callback) {
      const filehash = crypto.randomBytes(10).toString('HEX');
      const filename = `${filehash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
};

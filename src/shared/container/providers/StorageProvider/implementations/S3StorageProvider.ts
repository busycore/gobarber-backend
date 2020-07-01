import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(filename: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, filename);

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline;filename=${filename}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);
    return filename;
  }

  public async deleteFile(filename: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: filename,
      })
      .promise();
  }
}

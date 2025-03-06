import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  region: string;
  s3: AWS.S3;
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      signatureVersion: 'v4',
      region: process.env.S3_BUCKET_REGION,
    });
    this.s3 = new AWS.S3({});
  }
  async uploadPrivateFile(dataBuffer: Buffer, userID: number, filename: string): Promise<any> {
    return await this.s3
      .upload({
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
  }

  public generatePresignedUrl(fileName: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${uuid()}-${fileName}`,
      ACL: 'public-read',
    });
  }

  public generatePresignedUrlForGetObject(key: string): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
  }
}

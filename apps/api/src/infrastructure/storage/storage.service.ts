import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { EnvConfig } from '../../config/env.schema';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    this.bucket = this.configService.get('S3_BUCKET', { infer: true });

    this.client = new S3Client({
      endpoint: this.configService.get('S3_ENDPOINT', { infer: true }),
      region: this.configService.get('S3_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID', {
          infer: true,
        }),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY', {
          infer: true,
        }),
      },
      // MinIO با آدرس‌دهی مبتنی بر subdomain کار نمی‌کنه، این باید true باشه
      forcePathStyle: true,
    });
  }

  async upload(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  /**
   * لینک دانلود موقت (پیش‌فرض ۱۵ دقیقه) برای فایل‌های private
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresInSeconds = 900,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });
  }
}

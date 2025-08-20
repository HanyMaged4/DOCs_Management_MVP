import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.region = this.configService.get<string>('AWS_REGION') ?? (() => { throw new Error('AWS_REGION is not defined'); })();
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') ?? (() => { throw new Error('AWS_S3_BUCKET is not defined'); })(); // Ensure bucketName is always a string

    if (!accessKeyId || !secretAccessKey || !this.region) {
      throw new Error('AWS S3 configuration is missing');
    }

    if (!this.bucketName) {
      throw new Error('AWS S3 bucket name is not defined in the configuration');
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder?: string): Promise<{ url: string; key: string }> {
    // Fix: Generate unique filename to prevent conflicts
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.originalname.split('.').pop();
    const uniqueName = `${timestamp}-${randomId}.${fileExtension}`;
    
    const fileName = folder ? `${folder}/${uniqueName}` : uniqueName;

    const command = new PutObjectCommand({
      Bucket: this.bucketName, 
      Key: fileName, 
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Fix: Add ACL for public access
    });

    try {
      await this.s3.send(command);
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
      
      return {
        url,
        key: fileName
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
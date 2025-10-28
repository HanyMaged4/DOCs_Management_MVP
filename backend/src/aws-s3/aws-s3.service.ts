// src/aws-s3/aws-s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand ,GetObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.region = this.configService.get<string>('AWS_REGION') ?? '';
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') ?? '';

    if (!accessKeyId || !secretAccessKey || !this.region || !this.bucketName) {
      throw new Error('AWS S3 configuration is missing');
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, userId: number): Promise<{ url: string; key: string }> {

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.originalname.split('.').pop();
    const uniqueName = `${timestamp}-${randomId}.${fileExtension}`;
    

    const fileType = file.mimetype.startsWith('image/') ? 'img' : 'vid';
    const fileName = `user-${userId}/${fileType}/${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
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

  async getPresignedUrl(fileKey: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
      return url;
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }
    //streaminig the file to the backend -- if needed
    async getFileStream(fileKey: string): Promise<NodeJS.ReadableStream> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    try {
      const response = await this.s3.send(command);
      // response.Body is a readable stream in Node.js
      return response.Body as unknown as NodeJS.ReadableStream;
    } catch (error) {
      throw new Error(`Failed to get file stream: ${error.message}`);
    }
  }
}
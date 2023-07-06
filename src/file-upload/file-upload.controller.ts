import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3, Lambda, SNS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ImageMetadata, ImageMetadataModel } from './image-metadata.model';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Controller('upload')
export class FileUploadController {
  private readonly s3: S3;
  private readonly lambda: Lambda;
  private readonly sns: SNS;
  private readonly bucketName: string;
  private readonly tableName: string;
  private readonly topicArn: string;
  private readonly lambdaFunctionName: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ImageMetadataModel')
    private readonly imageMetadataModel: Model<ImageMetadata>,
  ) {
    this.s3 = new S3();
    this.lambda = new Lambda();
    this.sns = new SNS();
    this.bucketName = configService.get('AWS_S3_BUCKET_NAME');
    this.tableName = configService.get('AWS_DYNAMODB_TABLE_NAME');
    this.topicArn = configService.get('AWS_SNS_TOPIC_ARN');
    this.lambdaFunctionName = configService.get('AWS_LAMBDA_FUNCTION_NAME');
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file) {
    const key = `images/${uuidv4()}_${file.originalname}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
    };

    await this.s3.upload(params).promise();

    const recognizedObjects = await this.performImageRecognition(key);

    const imageMetadata = new this.imageMetadataModel({
      key,
      recognizedObjects,
    });

    await imageMetadata.save();

    await this.publishMessageToSNS(key, recognizedObjects);

    return { key };
  }

  private async performImageRecognition(key: string): Promise<string[]> {
    const lambdaParams = {
      FunctionName: this.lambdaFunctionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        bucketName: this.bucketName,
        key,
      }),
    };

    const response = await this.lambda.invoke(lambdaParams).promise();
    const payload = JSON.parse(response.Payload as string);

    return payload.recognizedObjects;
  }

  private async publishMessageToSNS(
    key: string,
    recognizedObjects: string[],
  ): Promise<void> {
    const message = JSON.stringify({ key, recognizedObjects });
    const snsParams = {
      TopicArn: this.topicArn,
      Message: message,
    };

    await this.sns.publish(snsParams).promise();
  }
}

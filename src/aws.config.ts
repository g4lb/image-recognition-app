import { ConfigService } from '@nestjs/config';
import { S3, Rekognition, DynamoDB, SNS, Lambda } from 'aws-sdk';

export const awsConfigProvider = {
  provide: ConfigService,
  useValue: new ConfigService(),
};

export const s3Provider = {
  provide: S3,
  useFactory: (configService: ConfigService) => {
    return new S3({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  },
  inject: [ConfigService],
};

export const rekognitionProvider = {
  provide: Rekognition,
  useFactory: (configService: ConfigService) => {
    return new Rekognition({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  },
  inject: [ConfigService],
};

export const documentClientProvider = {
  provide: DynamoDB.DocumentClient,
  useFactory: (configService: ConfigService) => {
    return new DynamoDB.DocumentClient({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  },
  inject: [ConfigService],
};

export const snsProvider = {
  provide: SNS,
  useFactory: (configService: ConfigService) => {
    return new SNS({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  },
  inject: [ConfigService],
};

export const lambdaProvider = {
  provide: Lambda,
  useFactory: (configService: ConfigService) => {
    return new Lambda({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  },
  inject: [ConfigService],
};

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadController } from './file-upload/file-upload.controller';
import {
  awsConfigProvider,
  s3Provider,
  rekognitionProvider,
  documentClientProvider,
  snsProvider,
  lambdaProvider,
} from './aws.config';
import {
  ImageMetadataModel,
  ImageMetadataSchema,
} from './file-upload/image-metadata.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'ImageMetadata', schema: ImageMetadataSchema },
    ]),
  ],
  controllers: [FileUploadController, AppController],
  providers: [
    awsConfigProvider,
    s3Provider,
    rekognitionProvider,
    documentClientProvider,
    snsProvider,
    lambdaProvider,
    {
      provide: 'ImageMetadataModel',
      useFactory: (configService: ConfigService) => {
        return ImageMetadataModel;
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}

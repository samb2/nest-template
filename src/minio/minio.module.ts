import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { ConfigService } from '@nestjs/config';
import { BucketEnum } from './enum/bucket.enum';

@Module({
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule implements OnModuleInit {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get('minio.synchronize')) {
      for (const existElement in BucketEnum) {
        const exist: boolean = await this.minioService.createBucketIfNotExist(
          BucketEnum[existElement],
        );
        if (!exist) {
          Logger.log(`${BucketEnum[existElement]} created`);
        }
      }
    }
  }
}

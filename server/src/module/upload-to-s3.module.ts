import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from '../web/rest/upload-to-s3.controller';
import { UploadService } from '../service/upload-to-s3.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

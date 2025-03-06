import { Module } from '@nestjs/common';
import { UploadModule } from './upload-to-s3.module';

@Module({
  imports: [UploadModule],
})
export class ExtendedModule {}

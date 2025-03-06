import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafeelController } from '../web/rest/kafeel.controller';
import { KafeelRepository } from '../repository/kafeel.repository';
import { KafeelService } from '../service/kafeel.service';

@Module({
  imports: [TypeOrmModule.forFeature([KafeelRepository])],
  controllers: [KafeelController],
  providers: [KafeelService],
  exports: [KafeelService],
})
export class KafeelModule {}

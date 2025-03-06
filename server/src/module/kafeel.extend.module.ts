import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafeelRepository } from '../repository/kafeel.repository';
import { KafeelService } from '../service/kafeel.service';
import { KafeelExtendedController } from '../web/rest/kafeel.extend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KafeelRepository])],
  controllers: [KafeelExtendedController],
  providers: [KafeelService],
  exports: [KafeelService],
})
export class KafeelExtendedModule {}

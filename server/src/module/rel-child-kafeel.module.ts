import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelChildKafeelController } from '../web/rest/rel-child-kafeel.controller';
import { RelChildKafeelRepository } from '../repository/rel-child-kafeel.repository';
import { RelChildKafeelService } from '../service/rel-child-kafeel.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelChildKafeelRepository])],
  controllers: [RelChildKafeelController],
  providers: [RelChildKafeelService],
  exports: [RelChildKafeelService],
})
export class RelChildKafeelModule {}

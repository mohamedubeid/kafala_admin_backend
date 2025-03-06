import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildHealthStatusController } from '../web/rest/child-health-status.controller';
import { ChildHealthStatusRepository } from '../repository/child-health-status.repository';
import { ChildHealthStatusService } from '../service/child-health-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildHealthStatusRepository])],
  controllers: [ChildHealthStatusController],
  providers: [ChildHealthStatusService],
  exports: [ChildHealthStatusService],
})
export class ChildHealthStatusModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildEducationStatusController } from '../web/rest/child-education-status.controller';
import { ChildEducationStatusRepository } from '../repository/child-education-status.repository';
import { ChildEducationStatusService } from '../service/child-education-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildEducationStatusRepository])],
  controllers: [ChildEducationStatusController],
  providers: [ChildEducationStatusService],
  exports: [ChildEducationStatusService],
})
export class ChildEducationStatusModule {}

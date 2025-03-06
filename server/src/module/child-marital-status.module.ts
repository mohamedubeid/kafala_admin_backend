import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildMaritalStatusController } from '../web/rest/child-marital-status.controller';
import { ChildMaritalStatusRepository } from '../repository/child-marital-status.repository';
import { ChildMaritalStatusService } from '../service/child-marital-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildMaritalStatusRepository])],
  controllers: [ChildMaritalStatusController],
  providers: [ChildMaritalStatusService],
  exports: [ChildMaritalStatusService],
})
export class ChildMaritalStatusModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildPrticipationsController } from '../web/rest/child-prticipations.controller';
import { ChildPrticipationsRepository } from '../repository/child-prticipations.repository';
import { ChildPrticipationsService } from '../service/child-prticipations.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildPrticipationsRepository])],
  controllers: [ChildPrticipationsController],
  providers: [ChildPrticipationsService],
  exports: [ChildPrticipationsService],
})
export class ChildPrticipationsModule {}

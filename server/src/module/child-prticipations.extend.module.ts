import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildPrticipationsRepository } from '../repository/child-prticipations.repository';
import { ChildPrticipationsExtendedService } from '../service/child-prticipations.extend.service';
import { ChildPrticipationsExtendedController } from '../web/rest/child-prticipations.extend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChildPrticipationsRepository])],
  controllers: [ChildPrticipationsExtendedController],
  providers: [ChildPrticipationsExtendedService],
  exports: [ChildPrticipationsExtendedService],
})
export class ChildPrticipationsExtendedModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildTransactionReportsRepository } from '../repository/child-transaction-reports.repository';
import { ChildTransactionReportsExtendedController } from '../web/rest/child-transaction-reports.extend.controller';
import { ChildTransactionReportsExtendedService } from '../service/child-transaction-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildTransactionReportsRepository])],
  controllers: [ChildTransactionReportsExtendedController],
  providers: [ChildTransactionReportsExtendedService],
  exports: [ChildTransactionReportsExtendedService],
})
export class ChildTransactionReportsExtendedModule {}

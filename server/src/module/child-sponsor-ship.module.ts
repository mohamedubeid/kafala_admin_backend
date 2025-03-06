import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildSponsorShipController } from '../web/rest/child-sponsor-ship.controller';
import { ChildSponsorShipRepository } from '../repository/child-sponsor-ship.repository';
import { ChildSponsorShipService } from '../service/child-sponsor-ship.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildSponsorShipRepository])],
  controllers: [ChildSponsorShipController],
  providers: [ChildSponsorShipService],
  exports: [ChildSponsorShipService],
})
export class ChildSponsorShipModule {}

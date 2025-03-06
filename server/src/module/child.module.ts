import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildController } from '../web/rest/child.controller';
import { ChildRepository } from '../repository/child.repository';
import { ChildService } from '../service/child.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChildRepository])],
  controllers: [ChildController],
  providers: [ChildService],
  exports: [ChildService],
})
export class ChildModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelSponsershipTypesController } from '../web/rest/rel-sponsership-types.controller';
import { RelSponsershipTypesRepository } from '../repository/rel-sponsership-types.repository';
import { RelSponsershipTypesService } from '../service/rel-sponsership-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelSponsershipTypesRepository])],
  controllers: [RelSponsershipTypesController],
  providers: [RelSponsershipTypesService],
  exports: [RelSponsershipTypesService],
})
export class RelSponsershipTypesModule {}

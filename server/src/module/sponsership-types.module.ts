import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsershipTypesController } from '../web/rest/sponsership-types.controller';
import { SponsershipTypesRepository } from '../repository/sponsership-types.repository';
import { SponsershipTypesService } from '../service/sponsership-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([SponsershipTypesRepository])],
  controllers: [SponsershipTypesController],
  providers: [SponsershipTypesService],
  exports: [SponsershipTypesService],
})
export class SponsershipTypesModule {}

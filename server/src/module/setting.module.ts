import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingController } from '../web/rest/setting.controller';
import { SettingRepository } from '../repository/setting.repository';
import { SettingService } from '../service/setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([SettingRepository])],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}

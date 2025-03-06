import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingRepository } from '../repository/setting.repository';
import { SettingExtendedService } from '../service/setting.extend.service';
import { SettingExtendedController } from '../web/rest/setting.extend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SettingRepository])],
  controllers: [SettingExtendedController],
  providers: [SettingExtendedService],
  exports: [SettingExtendedService],
})
export class SettingExtendedModule {}

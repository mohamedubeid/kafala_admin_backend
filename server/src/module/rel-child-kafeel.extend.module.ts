import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelChildKafeelRepository } from '../repository/rel-child-kafeel.repository';
import { RelChildKafeelExtendedController } from '../web/rest/rel-child-kafeel.extend.controller';
import { RelChildKafeelExtendedService } from '../service/rel-child-kafeel.extend.service';
import { KafeelRepository } from '../repository/kafeel.repository';
import { KafeelService } from '../service/kafeel.service';
import { TweetSMSService } from '../service/tweetsms.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelChildKafeelRepository,KafeelRepository])],
  controllers: [RelChildKafeelExtendedController],
  providers: [RelChildKafeelExtendedService,KafeelService, TweetSMSService],
  exports: [RelChildKafeelExtendedService,KafeelService, TweetSMSService],
})
export class RelChildKafeelExtendedExtendedModule {}

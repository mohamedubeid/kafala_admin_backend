import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController } from '../web/rest/user.jwt.controller';
import { config } from '../config';
import { AuthorityRepository } from '../repository/authority.repository';

import { PublicUserController } from '../web/rest/public.user.controller';
import { AccountController } from '../web/rest/account.controller';
import { KafeelService } from '../service/kafeel.service';
import { KafeelRepository } from '../repository/kafeel.repository';
import { ChildExtendedService } from '../service/child.extend.service';
import { ChildRepository } from '../repository/child.repository';
import { ChildHealthStatusExtendedService } from '../service/child-health-status.extend.service';
import { ChildMaritalStatusExtendedService } from '../service/child-marital-status.extend.service';
import { ChildSponsorShipExtendedService } from '../service/child-sponsor-ship.extend.service';
import { ChildHealthStatusRepository } from '../repository/child-health-status.repository';
import { ChildMaritalStatusRepository } from '../repository/child-marital-status.repository';
import { ChildSponsorShipRepository } from '../repository/child-sponsor-ship.repository';
import { ChildEducationStatusExtendedService } from '../service/child-education-status.extend.service';
import { ChildEducationStatusRepository } from '../repository/child-education-status.repository';
import { SponsershipTypesRepository } from '../repository/sponsership-types.repository';
import { RelSponsershipTypesRepository } from '../repository/rel-sponsership-types.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthorityRepository,
      KafeelRepository,
      ChildRepository,
      ChildHealthStatusRepository,
      ChildMaritalStatusRepository,
      ChildSponsorShipRepository,
      ChildEducationStatusRepository,
      SponsershipTypesRepository,
      RelSponsershipTypesRepository,
    ]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config['jhipster.security.authentication.jwt.base64-secret'],
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [UserJWTController, PublicUserController, AccountController],
  providers: [
    AuthService,
    JwtStrategy,
    KafeelService,
    ChildExtendedService,
    ChildHealthStatusExtendedService,
    ChildMaritalStatusExtendedService,
    ChildSponsorShipExtendedService,
    ChildEducationStatusExtendedService,
  ],
  exports: [AuthService, KafeelService, ChildExtendedService],
})
export class AuthModule {}

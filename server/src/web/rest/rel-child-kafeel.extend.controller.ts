import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RelChildKafeelDTO } from '../../service/dto/rel-child-kafeel.dto';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { RelChildKafeelExtendedService } from '../../service/rel-child-kafeel.extend.service';
import { SponsershipDuration } from '../../domain/enumeration/sponsership-duration';
import { KafeelService } from '../../service/kafeel.service';
import { ChildCertificateDTO } from '../../service/dto/childParticipation.dto';
import { ChildSponsoredDTO } from '../../service/dto/childSponsored.dto';
import { RelChildKafeelExtendedDTO } from '../../service/dto/rel-child-kafeel.extend.dto';
import { RelChildKafeelStatus } from '../../domain/enumeration/rel-child-kafeel-status';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { ILike } from 'typeorm';
import { TweetSMSService } from '../../service/tweetsms.service';
import { MailService } from '../../service/mail.service';
import { isEmail } from 'class-validator';

@Controller('api/v2/rel-child-kafeels')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('rel-child-kafeels')
export class RelChildKafeelExtendedController {
  logger = new Logger('RelChildKafeelController');

  constructor(
    private readonly relChildKafeelExtendedService: RelChildKafeelExtendedService,
    private readonly kafeelService: KafeelService,
    private readonly tweetSMSService: TweetSMSService,
    private mailService: MailService,
    
  ) {}

  @PostMethod('/')
  @Roles(RoleType.GUARANTOR, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create relChildKafeel' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RelChildKafeelDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() relChildKafeelDTO: RelChildKafeelExtendedDTO) {
    relChildKafeelDTO.startDate = new Date();
    const currentDate = new Date();

    // Save the first record with ACCEPTED status
    if (relChildKafeelDTO.duration === SponsershipDuration.QUARTERLY) {
      relChildKafeelDTO.expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 3));
    } else if (relChildKafeelDTO.duration === SponsershipDuration.ANNUAL) {
      relChildKafeelDTO.expirationDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    } else if (relChildKafeelDTO.duration === SponsershipDuration.SEMIANNUAL) {
      relChildKafeelDTO.expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 6));
    } else {
      relChildKafeelDTO.expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    relChildKafeelDTO.status = RelChildKafeelStatus.PENDING;
    const result = await this.relChildKafeelExtendedService.save(relChildKafeelDTO, req.user?.login);

    // Save the rest with PENDING status
    for (let i = 1; i < relChildKafeelDTO.numberOfTimes; i++) {
      const newDTO = { ...relChildKafeelDTO }; // Create a new object
      if (relChildKafeelDTO.duration === SponsershipDuration.QUARTERLY) {
        newDTO.expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 3));
      } else if (relChildKafeelDTO.duration === SponsershipDuration.ANNUAL) {
        newDTO.expirationDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
      } else if (relChildKafeelDTO.duration === SponsershipDuration.SEMIANNUAL) {
        newDTO.expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 6));
      } else {
        newDTO.expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      }
      newDTO.status = RelChildKafeelStatus.PENDING;
      await this.relChildKafeelExtendedService.save(newDTO, req.user?.login);
    }
    return result;
  }
  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: RelChildKafeelDTO,
  })
  async getAll(@Req() req: Request): Promise<RelChildKafeelDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const nationalId = req.query.nationalId as string;

    const [results, count] = await this.relChildKafeelExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: nationalId
        ? {
            child: {
              nationalId: ILike(`%${nationalId}%`),
            },
          }
        : {},
      relations: ['child', 'kafeel', 'kafeel.user'],
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }
  @Get('/:id')
  @Roles(RoleType.ADMIN, RoleType.CHILD_GUARDIAN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getOne(@Param('id') id: number): Promise<RelChildKafeelDTO> {
    return await this.relChildKafeelExtendedService.findById(id);
  }

  @Get('/web/getChildTransactions/:id')
  @Roles(RoleType.CHILD_GUARDIAN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getChildTransactions(@Param('id') id: number): Promise<ChildSponsoredDTO[]> {
    return await this.relChildKafeelExtendedService.getChildTransactions(id);
  }
  @Get('/web/getKafeelChildsIds')
  @Roles(RoleType.GUARANTOR)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getKafeelChildsIds(@Req() req: Request): Promise<number[]> {
    const kafeel = await this.kafeelService.findByFields({ where: { user: req.user } });
    return await this.relChildKafeelExtendedService.getChildsIdByKafeelId(kafeel?.id);
  }

  @Get('/web/getTotalChildSponsored')
  @Roles(RoleType.GUARANTOR, RoleType.CHILD_GUARDIAN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getTotalChildSponsored(@Req() req: Request): Promise<number> {
    return await this.relChildKafeelExtendedService.getTotalChildSponsored();
  }

  @Get('/web/getKafeelChildCertificate')
  @Roles(RoleType.GUARANTOR)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getKafeelChildCertificate(@Req() req: Request): Promise<ChildCertificateDTO[]> {
    const kafeel = await this.kafeelService.findByFields({ where: { user: req.user } });
    return await this.relChildKafeelExtendedService.getKafeelChildCertificate(kafeel?.id);
  }

  @Get('/web/getKafeelChilds')
  @Roles(RoleType.GUARANTOR)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getKafeelChilds(@Req() req: Request): Promise<ChildSponsoredDTO[]> {
    const kafeel = await this.kafeelService.findByFields({ where: { user: req.user } });
    return await this.relChildKafeelExtendedService.getKafeelChilds(kafeel?.id);
  }

  @Get('/web/getFirstPendingSubscription/:childId')
  @Roles(RoleType.GUARANTOR)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: RelChildKafeelDTO,
  })
  async getFirstPendingSubscription(@Req() req: Request, @Param('childId') childId: number): Promise<RelChildKafeelDTO | null> {
    const kafeel = await this.kafeelService.findByFields({ where: { user: req.user } });

    if (!kafeel) {
      throw new NotFoundException('Kafeel not found');
    }

    return await this.relChildKafeelExtendedService.getFirstPendingSubscriptionByKafeelAndChildId(kafeel.id, childId);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update relChildKafeel with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RelChildKafeelDTO,
  })
  async putId(@Req() req: Request, @Body() relChildKafeelDTO: RelChildKafeelDTO): Promise<RelChildKafeelDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelChildKafeel', relChildKafeelDTO.id);
    const existRelChildKafeel = await this.relChildKafeelExtendedService.findById(relChildKafeelDTO.id);
    //send email notification 
    if(existRelChildKafeel.status != relChildKafeelDTO.status) {
      if(relChildKafeelDTO.status == 'ACCEPTED') {
        if(isEmail(relChildKafeelDTO.kafeel.user.email)) {
          await this.mailService.sendEmail(relChildKafeelDTO, 'sponsor');
        }
        if(relChildKafeelDTO.child.createdBy != 'admin' && isEmail(relChildKafeelDTO.child.createdBy)) {
          await this.mailService.sendEmail(relChildKafeelDTO, 'guardian');
        }
      } else if(relChildKafeelDTO.status == 'REJECTED') {
        if(isEmail(relChildKafeelDTO.kafeel.user.email)) {
          await this.mailService.sendEmail(relChildKafeelDTO, 'sponsor');
        }
      }
    }

    // await this.tweetSMSService.sendSMS('00000000', 'Hi mohamed')
    return await this.relChildKafeelExtendedService.update(relChildKafeelDTO, req.user?.login);
  }
}

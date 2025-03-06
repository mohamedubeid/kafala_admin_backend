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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ChildPrticipationsDTO } from '../../service/dto/child-prticipations.dto';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildPrticipationsExtendedService } from '../../service/child-prticipations.extend.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';

@Controller('api/v2/child-prticipations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-prticipations')
export class ChildPrticipationsExtendedController {
  logger = new Logger('ChildPrticipationsController');

  constructor(private readonly childPrticipationsExtendedService: ChildPrticipationsExtendedService) {}

  @PostMethod('/')
  @Roles(RoleType.GUARANTOR, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create childPrticipations' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildPrticipationsDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childPrticipationsDTO: ChildPrticipationsDTO): Promise<ChildPrticipationsDTO> {
    const created = await this.childPrticipationsExtendedService.save(childPrticipationsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildPrticipations', created.id);
    return created;
  }
  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildPrticipationsDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildPrticipationsDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childPrticipationsExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/admin/:childId')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildPrticipationsDTO,
  })
  async getChildParticipations(@Req() req: Request, @Param('childId') childId: number): Promise<ChildPrticipationsDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ? req.query.page : req.query.page,
      req.query.size ? req.query.size : req.query.size,
      req.query.sort,
    );
    const { childParticipations, count } = await this.childPrticipationsExtendedService.childParticipations(pageRequest, childId);
    HeaderUtil.addPaginationHeaders(req.res, new Page(childParticipations, count, pageRequest));
    return childParticipations;
  }

  @Get('/:id')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildPrticipationsDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildPrticipationsDTO> {
    return await this.childPrticipationsExtendedService.findById(id);
  }
  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete childPrticipations' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildPrticipations', id);
    return await this.childPrticipationsExtendedService.deleteById(id);
  }
}

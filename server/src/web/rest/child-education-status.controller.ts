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
import { ChildEducationStatusDTO } from '../../service/dto/child-education-status.dto';
import { ChildEducationStatusService } from '../../service/child-education-status.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-education-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-education-statuses')
export class ChildEducationStatusController {
  logger = new Logger('ChildEducationStatusController');

  constructor(private readonly childEducationStatusService: ChildEducationStatusService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildEducationStatusDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildEducationStatusDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childEducationStatusService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildEducationStatusDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildEducationStatusDTO> {
    return await this.childEducationStatusService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childEducationStatus' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildEducationStatusDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childEducationStatusDTO: ChildEducationStatusDTO): Promise<ChildEducationStatusDTO> {
    const created = await this.childEducationStatusService.save(childEducationStatusDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationStatus', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childEducationStatus' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildEducationStatusDTO,
  })
  async put(@Req() req: Request, @Body() childEducationStatusDTO: ChildEducationStatusDTO): Promise<ChildEducationStatusDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationStatus', childEducationStatusDTO.id);
    return await this.childEducationStatusService.update(childEducationStatusDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childEducationStatus with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildEducationStatusDTO,
  })
  async putId(@Req() req: Request, @Body() childEducationStatusDTO: ChildEducationStatusDTO): Promise<ChildEducationStatusDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationStatus', childEducationStatusDTO.id);
    return await this.childEducationStatusService.update(childEducationStatusDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childEducationStatus' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildEducationStatus', id);
    return await this.childEducationStatusService.deleteById(id);
  }
}

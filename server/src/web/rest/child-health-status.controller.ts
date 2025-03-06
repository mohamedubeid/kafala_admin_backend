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
import { ChildHealthStatusDTO } from '../../service/dto/child-health-status.dto';
import { ChildHealthStatusService } from '../../service/child-health-status.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-health-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-health-statuses')
export class ChildHealthStatusController {
  logger = new Logger('ChildHealthStatusController');

  constructor(private readonly childHealthStatusService: ChildHealthStatusService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildHealthStatusDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildHealthStatusDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childHealthStatusService.findAndCount({
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
    type: ChildHealthStatusDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildHealthStatusDTO> {
    return await this.childHealthStatusService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childHealthStatus' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildHealthStatusDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childHealthStatusDTO: ChildHealthStatusDTO): Promise<ChildHealthStatusDTO> {
    const created = await this.childHealthStatusService.save(childHealthStatusDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildHealthStatus', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childHealthStatus' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildHealthStatusDTO,
  })
  async put(@Req() req: Request, @Body() childHealthStatusDTO: ChildHealthStatusDTO): Promise<ChildHealthStatusDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildHealthStatus', childHealthStatusDTO.id);
    return await this.childHealthStatusService.update(childHealthStatusDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childHealthStatus with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildHealthStatusDTO,
  })
  async putId(@Req() req: Request, @Body() childHealthStatusDTO: ChildHealthStatusDTO): Promise<ChildHealthStatusDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildHealthStatus', childHealthStatusDTO.id);
    return await this.childHealthStatusService.update(childHealthStatusDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childHealthStatus' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildHealthStatus', id);
    return await this.childHealthStatusService.deleteById(id);
  }
}

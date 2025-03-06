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
import { ChildMaritalStatusDTO } from '../../service/dto/child-marital-status.dto';
import { ChildMaritalStatusService } from '../../service/child-marital-status.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-marital-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-marital-statuses')
export class ChildMaritalStatusController {
  logger = new Logger('ChildMaritalStatusController');

  constructor(private readonly childMaritalStatusService: ChildMaritalStatusService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildMaritalStatusDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildMaritalStatusDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childMaritalStatusService.findAndCount({
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
    type: ChildMaritalStatusDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildMaritalStatusDTO> {
    return await this.childMaritalStatusService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childMaritalStatus' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildMaritalStatusDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childMaritalStatusDTO: ChildMaritalStatusDTO): Promise<ChildMaritalStatusDTO> {
    const created = await this.childMaritalStatusService.save(childMaritalStatusDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalStatus', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childMaritalStatus' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildMaritalStatusDTO,
  })
  async put(@Req() req: Request, @Body() childMaritalStatusDTO: ChildMaritalStatusDTO): Promise<ChildMaritalStatusDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalStatus', childMaritalStatusDTO.id);
    return await this.childMaritalStatusService.update(childMaritalStatusDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childMaritalStatus with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildMaritalStatusDTO,
  })
  async putId(@Req() req: Request, @Body() childMaritalStatusDTO: ChildMaritalStatusDTO): Promise<ChildMaritalStatusDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalStatus', childMaritalStatusDTO.id);
    return await this.childMaritalStatusService.update(childMaritalStatusDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childMaritalStatus' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildMaritalStatus', id);
    return await this.childMaritalStatusService.deleteById(id);
  }
}

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
import { ChildDTO } from '../../service/dto/child.dto';
import { ChildService } from '../../service/child.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/children')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('children')
export class ChildController {
  logger = new Logger('ChildController');

  constructor(private readonly childService: ChildService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childService.findAndCount({
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
    type: ChildDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildDTO> {
    return await this.childService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create child' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childDTO: ChildDTO): Promise<ChildDTO> {
    const created = await this.childService.save(childDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Child', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update child' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildDTO,
  })
  async put(@Req() req: Request, @Body() childDTO: ChildDTO): Promise<ChildDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Child', childDTO.id);
    return await this.childService.update(childDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update child with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildDTO,
  })
  async putId(@Req() req: Request, @Body() childDTO: ChildDTO): Promise<ChildDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Child', childDTO.id);
    return await this.childService.update(childDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete child' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Child', id);
    return await this.childService.deleteById(id);
  }
}

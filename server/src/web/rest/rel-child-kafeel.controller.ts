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
import { RelChildKafeelDTO } from '../../service/dto/rel-child-kafeel.dto';
import { RelChildKafeelService } from '../../service/rel-child-kafeel.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/rel-child-kafeels')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('rel-child-kafeels')
export class RelChildKafeelController {
  logger = new Logger('RelChildKafeelController');

  constructor(private readonly relChildKafeelService: RelChildKafeelService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: RelChildKafeelDTO,
  })
  async getAll(@Req() req: Request): Promise<RelChildKafeelDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.relChildKafeelService.findAndCount({
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
    type: RelChildKafeelDTO,
  })
  async getOne(@Param('id') id: number): Promise<RelChildKafeelDTO> {
    return await this.relChildKafeelService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create relChildKafeel' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RelChildKafeelDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() relChildKafeelDTO: RelChildKafeelDTO): Promise<RelChildKafeelDTO> {
    const created = await this.relChildKafeelService.save(relChildKafeelDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelChildKafeel', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update relChildKafeel' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RelChildKafeelDTO,
  })
  async put(@Req() req: Request, @Body() relChildKafeelDTO: RelChildKafeelDTO): Promise<RelChildKafeelDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelChildKafeel', relChildKafeelDTO.id);
    return await this.relChildKafeelService.update(relChildKafeelDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update relChildKafeel with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RelChildKafeelDTO,
  })
  async putId(@Req() req: Request, @Body() relChildKafeelDTO: RelChildKafeelDTO): Promise<RelChildKafeelDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelChildKafeel', relChildKafeelDTO.id);
    return await this.relChildKafeelService.update(relChildKafeelDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete relChildKafeel' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'RelChildKafeel', id);
    return await this.relChildKafeelService.deleteById(id);
  }
}

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
import { RelSponsershipTypesDTO } from '../../service/dto/rel-sponsership-types.dto';
import { RelSponsershipTypesService } from '../../service/rel-sponsership-types.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/rel-sponsership-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('rel-sponsership-types')
export class RelSponsershipTypesController {
  logger = new Logger('RelSponsershipTypesController');

  constructor(private readonly relSponsershipTypesService: RelSponsershipTypesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: RelSponsershipTypesDTO,
  })
  async getAll(@Req() req: Request): Promise<RelSponsershipTypesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.relSponsershipTypesService.findAndCount({
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
    type: RelSponsershipTypesDTO,
  })
  async getOne(@Param('id') id: number): Promise<RelSponsershipTypesDTO> {
    return await this.relSponsershipTypesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create relSponsershipTypes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RelSponsershipTypesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() relSponsershipTypesDTO: RelSponsershipTypesDTO): Promise<RelSponsershipTypesDTO> {
    const created = await this.relSponsershipTypesService.save(relSponsershipTypesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelSponsershipTypes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update relSponsershipTypes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RelSponsershipTypesDTO,
  })
  async put(@Req() req: Request, @Body() relSponsershipTypesDTO: RelSponsershipTypesDTO): Promise<RelSponsershipTypesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelSponsershipTypes', relSponsershipTypesDTO.id);
    return await this.relSponsershipTypesService.update(relSponsershipTypesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update relSponsershipTypes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RelSponsershipTypesDTO,
  })
  async putId(@Req() req: Request, @Body() relSponsershipTypesDTO: RelSponsershipTypesDTO): Promise<RelSponsershipTypesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'RelSponsershipTypes', relSponsershipTypesDTO.id);
    return await this.relSponsershipTypesService.update(relSponsershipTypesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete relSponsershipTypes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'RelSponsershipTypes', id);
    return await this.relSponsershipTypesService.deleteById(id);
  }
}

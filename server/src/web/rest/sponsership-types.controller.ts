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
import { SponsershipTypesDTO } from '../../service/dto/sponsership-types.dto';
import { SponsershipTypesService } from '../../service/sponsership-types.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/sponsership-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('sponsership-types')
export class SponsershipTypesController {
  logger = new Logger('SponsershipTypesController');

  constructor(private readonly sponsershipTypesService: SponsershipTypesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SponsershipTypesDTO,
  })
  async getAll(@Req() req: Request): Promise<SponsershipTypesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.sponsershipTypesService.findAndCount({
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
    type: SponsershipTypesDTO,
  })
  async getOne(@Param('id') id: number): Promise<SponsershipTypesDTO> {
    return await this.sponsershipTypesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create sponsershipTypes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: SponsershipTypesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() sponsershipTypesDTO: SponsershipTypesDTO): Promise<SponsershipTypesDTO> {
    const created = await this.sponsershipTypesService.save(sponsershipTypesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SponsershipTypes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update sponsershipTypes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SponsershipTypesDTO,
  })
  async put(@Req() req: Request, @Body() sponsershipTypesDTO: SponsershipTypesDTO): Promise<SponsershipTypesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SponsershipTypes', sponsershipTypesDTO.id);
    return await this.sponsershipTypesService.update(sponsershipTypesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update sponsershipTypes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SponsershipTypesDTO,
  })
  async putId(@Req() req: Request, @Body() sponsershipTypesDTO: SponsershipTypesDTO): Promise<SponsershipTypesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SponsershipTypes', sponsershipTypesDTO.id);
    return await this.sponsershipTypesService.update(sponsershipTypesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete sponsershipTypes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'SponsershipTypes', id);
    return await this.sponsershipTypesService.deleteById(id);
  }
}

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
import { KafeelDTO } from '../../service/dto/kafeel.dto';
import { KafeelService } from '../../service/kafeel.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/kafeels')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('kafeels')
export class KafeelController {
  logger = new Logger('KafeelController');

  constructor(private readonly kafeelService: KafeelService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: KafeelDTO,
  })
  async getAll(@Req() req: Request): Promise<KafeelDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.kafeelService.findAndCount({
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
    type: KafeelDTO,
  })
  async getOne(@Param('id') id: number): Promise<KafeelDTO> {
    return await this.kafeelService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create kafeel' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: KafeelDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() kafeelDTO: KafeelDTO): Promise<KafeelDTO> {
    const created = await this.kafeelService.save(kafeelDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Kafeel', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update kafeel' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: KafeelDTO,
  })
  async put(@Req() req: Request, @Body() kafeelDTO: KafeelDTO): Promise<KafeelDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Kafeel', kafeelDTO.id);
    return await this.kafeelService.update(kafeelDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update kafeel with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: KafeelDTO,
  })
  async putId(@Req() req: Request, @Body() kafeelDTO: KafeelDTO): Promise<KafeelDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Kafeel', kafeelDTO.id);
    return await this.kafeelService.update(kafeelDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete kafeel' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Kafeel', id);
    return await this.kafeelService.deleteById(id);
  }
}

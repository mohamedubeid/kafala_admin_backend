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
import { SettingDTO } from '../../service/dto/setting.dto';
import { SettingService } from '../../service/setting.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { SettingExtendedService } from '../..//service/setting.extend.service';

@Controller('api/v2/settings')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('settings')
export class SettingExtendedController {
  logger = new Logger('SettingController');

  constructor(private readonly settingExtendedService: SettingExtendedService) {}

  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SettingDTO,
  })
  async getAll(@Req() req: Request): Promise<SettingDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.settingExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }
  @Get('/aboutUs')
  @ApiResponse({
    status: 200,
    type: SettingDTO,
  })
  async aboutUs(@Req() req: Request): Promise<SettingDTO> {
    return await this.settingExtendedService.findByFields({ where: { key: 'aboutUs' } });
  }
  @Get('/donations_reach_children_without_expenses')
  @ApiResponse({
    status: 200,
    type: SettingDTO,
  })
  async donationsReachChildrenWithoutExpenses(@Req() req: Request): Promise<SettingDTO> {
    return await this.settingExtendedService.findByFields({ where: { key: 'donations_reach_children_without_expenses' } });
  }
  @Get('/:id')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SettingDTO,
  })
  async getOne(@Param('id') id: number): Promise<SettingDTO> {
    return await this.settingExtendedService.findById(id);
  }
  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update setting' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SettingDTO,
  })
  async put(@Req() req: Request, @Body() settingDTO: SettingDTO): Promise<SettingDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Setting', settingDTO.id);
    return await this.settingExtendedService.update(settingDTO, req.user?.login);
  }
  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update setting with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SettingDTO,
  })
  async putId(@Req() req: Request, @Body() settingDTO: SettingDTO): Promise<SettingDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Setting', settingDTO.id);
    return await this.settingExtendedService.update(settingDTO, req.user?.login);
  }
}

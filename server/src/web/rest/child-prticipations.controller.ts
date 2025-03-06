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
import { ChildPrticipationsService } from '../../service/child-prticipations.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-prticipations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-prticipations')
export class ChildPrticipationsController {
  logger = new Logger('ChildPrticipationsController');

  constructor(private readonly childPrticipationsService: ChildPrticipationsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildPrticipationsDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildPrticipationsDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childPrticipationsService.findAndCount({
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
    type: ChildPrticipationsDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildPrticipationsDTO> {
    return await this.childPrticipationsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childPrticipations' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildPrticipationsDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childPrticipationsDTO: ChildPrticipationsDTO): Promise<ChildPrticipationsDTO> {
    const created = await this.childPrticipationsService.save(childPrticipationsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildPrticipations', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childPrticipations' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildPrticipationsDTO,
  })
  async put(@Req() req: Request, @Body() childPrticipationsDTO: ChildPrticipationsDTO): Promise<ChildPrticipationsDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildPrticipations', childPrticipationsDTO.id);
    return await this.childPrticipationsService.update(childPrticipationsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childPrticipations with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildPrticipationsDTO,
  })
  async putId(@Req() req: Request, @Body() childPrticipationsDTO: ChildPrticipationsDTO): Promise<ChildPrticipationsDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildPrticipations', childPrticipationsDTO.id);
    return await this.childPrticipationsService.update(childPrticipationsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childPrticipations' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildPrticipations', id);
    return await this.childPrticipationsService.deleteById(id);
  }
}

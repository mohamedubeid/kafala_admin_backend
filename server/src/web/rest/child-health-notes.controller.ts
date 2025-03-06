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
import { ChildHealthNotesDTO } from '../../service/dto/child-health-notes.dto';
import { ChildHealthNotesService } from '../../service/child-health-notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-health-notes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-health-notes')
export class ChildHealthNotesController {
  logger = new Logger('ChildHealthNotesController');

  constructor(private readonly childHealthNotesService: ChildHealthNotesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildHealthNotesDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildHealthNotesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childHealthNotesService.findAndCount({
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
    type: ChildHealthNotesDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildHealthNotesDTO> {
    return await this.childHealthNotesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childHealthNotes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildHealthNotesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childHealthNotesDTO: ChildHealthNotesDTO): Promise<ChildHealthNotesDTO> {
    const created = await this.childHealthNotesService.save(childHealthNotesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildHealthNotes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childHealthNotes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildHealthNotesDTO,
  })
  async put(@Req() req: Request, @Body() childHealthNotesDTO: ChildHealthNotesDTO): Promise<ChildHealthNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildHealthNotes', childHealthNotesDTO.id);
    return await this.childHealthNotesService.update(childHealthNotesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childHealthNotes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildHealthNotesDTO,
  })
  async putId(@Req() req: Request, @Body() childHealthNotesDTO: ChildHealthNotesDTO): Promise<ChildHealthNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildHealthNotes', childHealthNotesDTO.id);
    return await this.childHealthNotesService.update(childHealthNotesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childHealthNotes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildHealthNotes', id);
    return await this.childHealthNotesService.deleteById(id);
  }
}

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
import { ChildNotesDTO } from '../../service/dto/child-notes.dto';
import { ChildNotesService } from '../../service/child-notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-notes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-notes')
export class ChildNotesController {
  logger = new Logger('ChildNotesController');

  constructor(private readonly childNotesService: ChildNotesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildNotesDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildNotesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childNotesService.findAndCount({
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
    type: ChildNotesDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildNotesDTO> {
    return await this.childNotesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childNotes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildNotesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childNotesDTO: ChildNotesDTO): Promise<ChildNotesDTO> {
    const created = await this.childNotesService.save(childNotesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildNotes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childNotes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildNotesDTO,
  })
  async put(@Req() req: Request, @Body() childNotesDTO: ChildNotesDTO): Promise<ChildNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildNotes', childNotesDTO.id);
    return await this.childNotesService.update(childNotesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childNotes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildNotesDTO,
  })
  async putId(@Req() req: Request, @Body() childNotesDTO: ChildNotesDTO): Promise<ChildNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildNotes', childNotesDTO.id);
    return await this.childNotesService.update(childNotesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childNotes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildNotes', id);
    return await this.childNotesService.deleteById(id);
  }
}

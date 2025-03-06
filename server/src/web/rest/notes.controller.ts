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
import { NotesDTO } from '../../service/dto/notes.dto';
import { NotesService } from '../../service/notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/notes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('notes')
export class NotesController {
  logger = new Logger('NotesController');

  constructor(private readonly notesService: NotesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: NotesDTO,
  })
  async getAll(@Req() req: Request): Promise<NotesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.notesService.findAndCount({
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
    type: NotesDTO,
  })
  async getOne(@Param('id') id: number): Promise<NotesDTO> {
    return await this.notesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create notes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: NotesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() notesDTO: NotesDTO): Promise<NotesDTO> {
    const created = await this.notesService.save(notesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Notes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update notes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: NotesDTO,
  })
  async put(@Req() req: Request, @Body() notesDTO: NotesDTO): Promise<NotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Notes', notesDTO.id);
    return await this.notesService.update(notesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update notes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: NotesDTO,
  })
  async putId(@Req() req: Request, @Body() notesDTO: NotesDTO): Promise<NotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Notes', notesDTO.id);
    return await this.notesService.update(notesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete notes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Notes', id);
    return await this.notesService.deleteById(id);
  }
}

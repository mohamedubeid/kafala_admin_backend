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
import { ChildEducationNotesDTO } from '../../service/dto/child-education-notes.dto';
import { ChildEducationNotesService } from '../../service/child-education-notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-education-notes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-education-notes')
export class ChildEducationNotesController {
  logger = new Logger('ChildEducationNotesController');

  constructor(private readonly childEducationNotesService: ChildEducationNotesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildEducationNotesDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildEducationNotesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childEducationNotesService.findAndCount({
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
    type: ChildEducationNotesDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildEducationNotesDTO> {
    return await this.childEducationNotesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childEducationNotes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildEducationNotesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childEducationNotesDTO: ChildEducationNotesDTO): Promise<ChildEducationNotesDTO> {
    const created = await this.childEducationNotesService.save(childEducationNotesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationNotes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childEducationNotes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildEducationNotesDTO,
  })
  async put(@Req() req: Request, @Body() childEducationNotesDTO: ChildEducationNotesDTO): Promise<ChildEducationNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationNotes', childEducationNotesDTO.id);
    return await this.childEducationNotesService.update(childEducationNotesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childEducationNotes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildEducationNotesDTO,
  })
  async putId(@Req() req: Request, @Body() childEducationNotesDTO: ChildEducationNotesDTO): Promise<ChildEducationNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationNotes', childEducationNotesDTO.id);
    return await this.childEducationNotesService.update(childEducationNotesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childEducationNotes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildEducationNotes', id);
    return await this.childEducationNotesService.deleteById(id);
  }
}

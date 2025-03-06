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
import { ChildMaritalNotesDTO } from '../../service/dto/child-marital-notes.dto';
import { ChildMaritalNotesService } from '../../service/child-marital-notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-marital-notes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-marital-notes')
export class ChildMaritalNotesController {
  logger = new Logger('ChildMaritalNotesController');

  constructor(private readonly childMaritalNotesService: ChildMaritalNotesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildMaritalNotesDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildMaritalNotesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childMaritalNotesService.findAndCount({
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
    type: ChildMaritalNotesDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildMaritalNotesDTO> {
    return await this.childMaritalNotesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childMaritalNotes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildMaritalNotesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childMaritalNotesDTO: ChildMaritalNotesDTO): Promise<ChildMaritalNotesDTO> {
    const created = await this.childMaritalNotesService.save(childMaritalNotesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalNotes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childMaritalNotes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildMaritalNotesDTO,
  })
  async put(@Req() req: Request, @Body() childMaritalNotesDTO: ChildMaritalNotesDTO): Promise<ChildMaritalNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalNotes', childMaritalNotesDTO.id);
    return await this.childMaritalNotesService.update(childMaritalNotesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childMaritalNotes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildMaritalNotesDTO,
  })
  async putId(@Req() req: Request, @Body() childMaritalNotesDTO: ChildMaritalNotesDTO): Promise<ChildMaritalNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalNotes', childMaritalNotesDTO.id);
    return await this.childMaritalNotesService.update(childMaritalNotesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childMaritalNotes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildMaritalNotes', id);
    return await this.childMaritalNotesService.deleteById(id);
  }
}

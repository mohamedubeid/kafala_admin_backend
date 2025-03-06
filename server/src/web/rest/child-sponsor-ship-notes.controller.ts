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
import { ChildSponsorShipNotesDTO } from '../../service/dto/child-sponsor-ship-notes.dto';
import { ChildSponsorShipNotesService } from '../../service/child-sponsor-ship-notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-sponsor-ship-notes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-sponsor-ship-notes')
export class ChildSponsorShipNotesController {
  logger = new Logger('ChildSponsorShipNotesController');

  constructor(private readonly childSponsorShipNotesService: ChildSponsorShipNotesService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildSponsorShipNotesDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildSponsorShipNotesDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childSponsorShipNotesService.findAndCount({
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
    type: ChildSponsorShipNotesDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildSponsorShipNotesDTO> {
    return await this.childSponsorShipNotesService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childSponsorShipNotes' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildSponsorShipNotesDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childSponsorShipNotesDTO: ChildSponsorShipNotesDTO): Promise<ChildSponsorShipNotesDTO> {
    const created = await this.childSponsorShipNotesService.save(childSponsorShipNotesDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildSponsorShipNotes', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childSponsorShipNotes' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildSponsorShipNotesDTO,
  })
  async put(@Req() req: Request, @Body() childSponsorShipNotesDTO: ChildSponsorShipNotesDTO): Promise<ChildSponsorShipNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildSponsorShipNotes', childSponsorShipNotesDTO.id);
    return await this.childSponsorShipNotesService.update(childSponsorShipNotesDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childSponsorShipNotes with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildSponsorShipNotesDTO,
  })
  async putId(@Req() req: Request, @Body() childSponsorShipNotesDTO: ChildSponsorShipNotesDTO): Promise<ChildSponsorShipNotesDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildSponsorShipNotes', childSponsorShipNotesDTO.id);
    return await this.childSponsorShipNotesService.update(childSponsorShipNotesDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childSponsorShipNotes' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildSponsorShipNotes', id);
    return await this.childSponsorShipNotesService.deleteById(id);
  }
}

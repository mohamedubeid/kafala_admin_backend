import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post as PostMethod,
  UseGuards,
  Req,
  UseInterceptors,
  Put,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ChildHealthStatusDTO } from '../../service/dto/child-health-status.dto';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildHealthStatusExtendedService } from '../../service/child-health-status.extend.service';
import { NotesService } from '../../service/notes.service';
import { ChildHealthNotesService } from '../../service/child-health-notes.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';

@Controller('api/v2/child-health-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-health-statuses')
export class ChildHealthStatusExtendedController {
  logger = new Logger('ChildHealthStatusController');

  constructor(
    private readonly childHealthStatusExtendedService: ChildHealthStatusExtendedService,
    private readonly notesService: NotesService,
    private readonly childHealthNotesService: ChildHealthNotesService,
  ) {}


  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildHealthStatusDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildHealthStatusDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childHealthStatusExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }
  @Get('/:id')
  @Roles(RoleType.USER,RoleType.ADMIN, RoleType.CHILD_GUARDIAN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildHealthStatusDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildHealthStatusDTO> {
    return await this.childHealthStatusExtendedService.findById(id);
  }

  @Put('/addUpdateChildHealthStatus')
  @Roles(RoleType.USER, RoleType.ADMIN,RoleType.App_MANAGER,RoleType.ORGANIZATIONAL, RoleType.CHILD_GUARDIAN)
  @ApiOperation({ summary: 'Update child' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildHealthStatusDTO,
  })
  async addUpdateChildHealthStatus(@Req() req: Request, @Body() childHealthStatusDTO: ChildHealthStatusDTO): Promise<ChildHealthStatusDTO> {
    const childHealthStatusExists = await this.childHealthStatusExtendedService.findByFields({
      where: { child: childHealthStatusDTO.child },
      relations: ['childHealthNotes'],
    });
    // if childHealthStatusExists update it if not create it
    const storedChildHealthStatus = await this.childHealthStatusExtendedService.save(
      { ...childHealthStatusExists, ...childHealthStatusDTO, childHealthNotes: childHealthStatusExists?.childHealthNotes },
      req.user?.login,
    );
    //add notes to child health

    for (const childHealthNote of childHealthStatusDTO.childHealthNotes) {
      if (childHealthNote.notes) {
          let note;

          if (childHealthNote.notes.id) {
              if (childHealthNote.notes.note.trim() === "") {
                  await this.childHealthNotesService.deleteById(childHealthNote.id);
                  await this.notesService.deleteById(childHealthNote.notes.id);
              } else {
                  note = await this.notesService.update(childHealthNote.notes, req.user?.login);
              }
          } else if (childHealthNote.notes.note.trim() !== "") {
              note = await this.notesService.save(childHealthNote.notes, req.user?.login);
          }
          if(note){
            childHealthNote.childHealthStatus = storedChildHealthStatus;
            childHealthNote.notes = note;
            await this.childHealthNotesService.save(childHealthNote, req.user?.login);

          }

      }
  }

    return storedChildHealthStatus;
  }

}

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
import { ChildEducationStatusDTO } from '../../service/dto/child-education-status.dto';
import { ChildEducationStatusService } from '../../service/child-education-status.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildEducationStatusExtendedService } from '../../service/child-education-status.extend.service';
import { NotesService } from '../../service/notes.service';
import { ChildEducationNotesService } from '../../service/child-education-notes.service';

@Controller('api/v2/child-education-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-education-statuses')
export class ChildEducationStatusExtendedController {
  logger = new Logger('ChildEducationStatusController');

  constructor(
    private readonly childEducationStatusExtendedService: ChildEducationStatusExtendedService,
    private readonly notesService: NotesService,
    private readonly childEducationNotesService: ChildEducationNotesService,
  ) {}


  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN,RoleType.App_MANAGER,RoleType.ORGANIZATIONAL)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildEducationStatusDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildEducationStatusDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childEducationStatusExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }
  @Get('/:id')
  @Roles(RoleType.USER,RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildEducationStatusDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildEducationStatusDTO> {
    return await this.childEducationStatusExtendedService.findById(id);
  }
  @PostMethod('/')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create childEducationStatus' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildEducationStatusDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childEducationStatusDTO: ChildEducationStatusDTO): Promise<ChildEducationStatusDTO> {
    const created = await this.childEducationStatusExtendedService.save(childEducationStatusDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildEducationStatus', created.id);
    return created;
  }
  @Put('/addUpdateChildEdicationStatus')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update child' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildEducationStatusDTO,
  })
  async addUpdateChildEducationStatus(
    @Req() req: Request,
    @Body() childEducationStatusDTO: ChildEducationStatusDTO,
  ): Promise<ChildEducationStatusDTO> {
    const childEducationStatusExists = await this.childEducationStatusExtendedService.findByFields({
      where: { child: childEducationStatusDTO.child },
      relations: ['childEducationNotes'],
    });
    // if childEducationStatus exists update it if not create it
    const storedChildEducationStatus = await this.childEducationStatusExtendedService.save(
      { ...childEducationStatusExists, ...childEducationStatusDTO, childEducationNotes: childEducationStatusExists?.childEducationNotes },
      req.user?.login,
    );
    // add notes to child Education
  for (const childEducationNote of childEducationStatusDTO.childEducationNotes) {
    if (childEducationNote.notes) {
        let note;

        if (childEducationNote.notes.id) {
            if (childEducationNote.notes.note.trim() === "") {
                await this.childEducationNotesService.deleteById(childEducationNote.id);
                await this.notesService.deleteById(childEducationNote.notes.id);
            } else {
                note = await this.notesService.update(childEducationNote.notes, req.user?.login);
            }
        } else if (childEducationNote.notes.note.trim() !== "") {
            note = await this.notesService.save(childEducationNote.notes, req.user?.login);
        }
        if(note){
          childEducationNote.childEducationStatus = storedChildEducationStatus;
          childEducationNote.notes = note;
          await this.childEducationNotesService.save(childEducationNote, req.user?.login);

        }

    }
}
    return storedChildEducationStatus;
  }
}

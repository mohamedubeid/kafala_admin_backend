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
import { ChildMaritalStatusDTO } from '../../service/dto/child-marital-status.dto';
import { ChildMaritalStatusService } from '../../service/child-marital-status.service';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildMaritalStatusExtendedService } from '../../service/child-marital-status.extend.service';
import { NotesService } from '../../service/notes.service';
import { ChildMaritalNotesService } from '../../service/child-marital-notes.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { OrphanClassification } from '../../domain/enumeration/orphan-classification';

@Controller('api/v2/child-marital-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-marital-statuses')
export class ChildMaritalStatusExtendedController {
  logger = new Logger('ChildMaritalStatusController');
  constructor(
    private readonly childMaritalStatusExtendedService: ChildMaritalStatusExtendedService,
    private readonly notesService: NotesService,
    private readonly childMaritalNotesService: ChildMaritalNotesService,
  ) {}

  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN,RoleType.App_MANAGER,RoleType.ORGANIZATIONAL)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildMaritalStatusDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildMaritalStatusDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childMaritalStatusExtendedService.findAndCount({
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
    type: ChildMaritalStatusDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildMaritalStatusDTO> {
    return await this.childMaritalStatusExtendedService.findById(id);
  }


  @PostMethod('/')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create childMaritalStatus' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildMaritalStatusDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childMaritalStatusDTO: ChildMaritalStatusDTO): Promise<ChildMaritalStatusDTO> {
    const created = await this.childMaritalStatusExtendedService.save(childMaritalStatusDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildMaritalStatus', created.id);
    return created;
  }
  @Put('/addUpdateChildMirtalStatus')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update child' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildMaritalStatusDTO,
  })
  async addUpdateChildMirtalStatus(
    @Req() req: Request,
    @Body() childMaritalStatusDTO: ChildMaritalStatusDTO,
  ): Promise<ChildMaritalStatusDTO> {
    const childMirtalStatusExists = await this.childMaritalStatusExtendedService.findByFields({
      where: { child: childMaritalStatusDTO.child },
      relations: ['childMaritalNotes'],
    });
    // if childMirtalStatus exists update it if not create it
     if(childMaritalStatusDTO.orphanClassification == OrphanClassification.MOTHER_AND_FATHER){
      childMaritalStatusDTO.orphanClassification=OrphanClassification.OTHER;
     }
    const storedChildMirtalStatus = await this.childMaritalStatusExtendedService.save(
      { ...childMirtalStatusExists, ...childMaritalStatusDTO, childMaritalNotes: childMirtalStatusExists?.childMaritalNotes },
      req.user?.login,
    );
    // add notes to child mirtal
  for (const childMirtalNote of childMaritalStatusDTO.childMaritalNotes) {
    if (childMirtalNote.notes) {
        let note;

        if (childMirtalNote.notes.id) {
            if (childMirtalNote.notes.note.trim() === "") {
                await this.childMaritalNotesService.deleteById(childMirtalNote.id);
                await this.notesService.deleteById(childMirtalNote.notes.id);
            } else {
                note = await this.notesService.update(childMirtalNote.notes, req.user?.login);
            }
        } else if (childMirtalNote.notes.note.trim() !== "") {
            note = await this.notesService.save(childMirtalNote.notes, req.user?.login);
        }
        if(note){
          childMirtalNote.childMaritalStatus = storedChildMirtalStatus;
          childMirtalNote.notes = note;
          await this.childMaritalNotesService.save(childMirtalNote, req.user?.login);

        }

    }
}
    return storedChildMirtalStatus;
  }
}

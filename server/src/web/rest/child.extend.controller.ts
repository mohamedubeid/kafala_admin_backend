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
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ChildDTO } from '../../service/dto/child.dto';
import { AuthGuard, Roles, RolesGuard, RoleType, transformPassword } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildExtendedService } from '../../service/child.extend.service';
import { ChildExtendedDTO } from '../../service/dto/child.extend.dto';
import { UserService } from '../../service/user.service';
import { NotesService } from '../../service/notes.service';
import { ChildNotesExtendedService } from '../../service/child-notes.extend.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { ChildSponsorShipExtendedService } from '../../service/child-sponsor-ship.extend.service';

@Controller('api/v2/children')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('children')
export class ChildExtendedController {
  logger = new Logger('ChildController');

  constructor(
    private readonly childExtendedService: ChildExtendedService,
    private readonly userService: UserService,
    private readonly notesService: NotesService,
    private readonly childNotesExtendedService: ChildNotesExtendedService,
    private readonly childSponsorShipExtendedService: ChildSponsorShipExtendedService,
  ) {}

  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.App_MANAGER, RoleType.ORGANIZATIONAL)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/getChildsSponsorShip')
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.App_MANAGER, RoleType.ORGANIZATIONAL)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getChildSponsorShip(@Req() req: Request) {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ? req.query.page : req.query.page,
      req.query.size ? req.query.size : req.query.size,
      req.query.sort,
    );
    const name = req?.query?.name?.trim().toLowerCase() || '';
    return await this.childSponsorShipExtendedService.getChilds(pageRequest, name);
  }
  @Get('/getChilds')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getChilds(@Req() req: Request) {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ? req.query.page : req.query.page,
      req.query.size ? req.query.size : req.query.size,
      req.query.sort,
    );
    const name = req?.query?.name?.trim().toLowerCase() || '';
    const ageFrom = req?.query?.ageFrom;
    const ageTo = req?.query?.ageTo;
    const sponerShipType = req?.query?.sponerShipType;
    const orphanClassification = req?.query?.orphanClassification;
    const hasSponership = req?.query?.hasSponership;
    const startDate = req?.query?.startDate;
    const endDate = req?.query?.endDate;

    return await this.childExtendedService.getChilds(
      pageRequest,
      name,
      ageFrom,
      ageTo,
      sponerShipType,
      orphanClassification,
      startDate,
      endDate,
      hasSponership,
    );
  }
  @Get('/admin/getChilds')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getAdminChilds(@Req() req: Request) {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ? req.query.page : req.query.page,
      req.query.size ? req.query.size : req.query.size,
      req.query.sort,
    );
    const name = req?.query?.name?.trim().toLowerCase() || '';
    const ageFrom = req?.query?.ageFrom;
    const ageTo = req?.query?.ageTo;
    const sponerShipType = req?.query?.sponerShipType;
    const orphanClassification = req?.query?.orphanClassification;
    const dateFrom = req?.query?.dateFrom;
    const dateTo = req?.query?.dateTo;
    const { data, count } = await this.childExtendedService.getAdminChilds(
      pageRequest,
      name,
      ageFrom,
      ageTo,
      sponerShipType,
      orphanClassification,
      dateFrom,
      dateTo,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(data, count, pageRequest));
    return data;
  }

  @Get('/admin/getExportedChildData')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getAdminChildsWithoutPaginations(@Req() req: Request) {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ? req.query.page : req.query.page,
      req.query.size ? req.query.size : req.query.size,
      req.query.sort,
    );
    const name = req?.query?.name?.trim().toLowerCase() || '';
    const ageFrom = req?.query?.ageFrom;
    const ageTo = req?.query?.ageTo;
    const sponerShipType = req?.query?.sponerShipType;
    const orphanClassification = req?.query?.orphanClassification;
    const dateFrom = req?.query?.dateFrom;
    const dateTo = req?.query?.dateTo;
    const { data, count } = await this.childExtendedService.getAdminChilds(
      pageRequest,
      name,
      ageFrom,
      ageTo,
      sponerShipType,
      orphanClassification,
      dateFrom,
      dateTo,
    );
    HeaderUtil.addPaginationHeaders(req.res, new Page(data, count, pageRequest));
    return data;
  }
  @Get('/getChildsSponsorShip/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getSingleChild(@Param('id') id: number) {
    const child = await this.childSponsorShipExtendedService.getSingleChild(id);
    return child;
  }

  @Get('/aboutus/chilList')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getAboutUsChilds() {
    const child = await this.childExtendedService.getAboutUsChildList();
    return child;
  }

  @PostMethod('/')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create child' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childDTO: ChildDTO): Promise<ChildDTO> {
    const created = await this.childExtendedService.save(childDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Child', created.id);
    return created;
  }

  @PostMethod('/import/childs')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Import childs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully imported.',
    type: ChildDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async importChilds(@Req() req: Request, @Body() childsDTO: any[]): Promise<any[]> {
    const created = await this.childExtendedService.importChilds(childsDTO);
    return created;
  }

  @Put('/addUpdateChild')
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.App_MANAGER, RoleType.ORGANIZATIONAL, RoleType.CHILD_GUARDIAN)
  @ApiOperation({ summary: 'Update child' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildDTO,
  })
  async addUpdateChild(@Req() req: Request, @Body() childDTO: ChildExtendedDTO): Promise<ChildDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Child', childDTO.id);
    let childExists = await this.childExtendedService.findById(childDTO.id ? childDTO.id : 0);
    //check if another account with different role has the same email..
    // if (childDTO.email) {
    //   const userByEmail = await this.userService.findByFields({ where: { email: childDTO.email } });
    //   const childByemail = await this.childExtendedService.findByFields({ where: { email: childDTO.email } });
    //   if ((userByEmail && !userByEmail.authorities.includes('ROLE_CHILD')) || (!childExists && childByemail)) {
    //     throw new HttpException('error.emailexists', HttpStatus.BAD_REQUEST);
    //   }
    // }

    let userByNationalId = await this.childExtendedService.findByFields({ where: { nationalId: childDTO.nationalId } });

    if ((childExists && userByNationalId && userByNationalId.email !== childExists.email) || (!childExists && userByNationalId)) {
      throw new HttpException('error.NationalIdExists', HttpStatus.BAD_REQUEST);
    }

    const storedChild = await this.childExtendedService.save(
      { ...childExists, ...childDTO, childNotes: childExists?.childNotes },
      req.user?.login,
    );

    // Fetch existing notes
    // const existingNotes = await this.childNotesExtendedService.findByChildId(storedChild.id);

    for (const childNote of childDTO.childNotes) {
      if (childNote.notes) {
        let note;

        if (childNote.notes.id) {
          if (childNote.notes.note.trim() === '') {
            await this.childNotesExtendedService.deleteById(childNote.id);
            await this.notesService.deleteById(childNote.notes.id);
          } else {
            note = await this.notesService.update(childNote.notes, req.user?.login);
          }
        } else if (childNote.notes.note.trim() !== '') {
          note = await this.notesService.save(childNote.notes, req.user?.login);
        }
        if (note) {
          childNote.child = storedChild;
          childNote.notes = note;
          await this.childNotesExtendedService.save(childNote, req.user?.login);
        }
      }
    }

    return storedChild;
  }

  @Get('/web/getChildTotalSponsored/:childId')
  @Roles(RoleType.USER, RoleType.GUARANTOR)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getChildTotalSponsored(@Param('childId') childId: number): Promise<ChildDTO> {
    return await this.childExtendedService.getChildTotalSponsored(childId);
  }

  @Get('/:id')
  @Roles(RoleType.USER, RoleType.GUARANTOR)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildDTO> {
    return await this.childExtendedService.findById(id);
  }

  @Get('/web/childStatistics')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async childStatistics(): Promise<{ fatherOrphanCount: number | 0; motherOrphanCount: number | 0; fatherAndMotherCount: number | 0 }> {
    return await this.childExtendedService.getChildStatistics();
  }

  @Put('child/updateScore')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildDTO,
  })
  async updateScore(@Body() body: { childId; score }) {
    return await this.childExtendedService.updateScore(body.childId, body.score);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete child' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Child', id);
    return await this.childExtendedService.deleteById(id);
  }
}

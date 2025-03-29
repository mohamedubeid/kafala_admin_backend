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
import { ChildSponsorShipDTO } from '../../service/dto/child-sponsor-ship.dto';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildSponsorShipExtendedService } from '../../service/child-sponsor-ship.extend.service';
import { ChildSponsorShipNotesService } from '../../service/child-sponsor-ship-notes.service';
import { NotesService } from '../../service/notes.service';
import { SponsershipTypesService } from '../../service/sponsership-types.service';
import { RelSponsershipTypesService } from '../../service/rel-sponsership-types.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';

@Controller('api/v2/child-sponsor-ships')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-sponsor-ships')
export class ChildSponsorShipExtendedController {
  logger = new Logger('ChildSponsorShipController');

  constructor(
    private readonly childSponsorShipService: ChildSponsorShipExtendedService,
    private readonly childSponsorShipNotesService: ChildSponsorShipNotesService,
    private readonly notesService: NotesService,
    private readonly sponsershipTypesService: SponsershipTypesService,
    private readonly relSponsershipTypesService: RelSponsershipTypesService,
  ) {}


  @Get('/')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildSponsorShipDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildSponsorShipDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childSponsorShipService.findAndCount({
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
    type: ChildSponsorShipDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildSponsorShipDTO> {
    return await this.childSponsorShipService.findById(id);
  }


  @Put('/addUpdateChildSponsorship')
  @Roles(RoleType.USER, RoleType.ADMIN,RoleType.App_MANAGER,RoleType.ORGANIZATIONAL, RoleType.CHILD_GUARDIAN)
  @ApiOperation({ summary: 'Update child' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildSponsorShipDTO,
  })
  async addUpdateChildSponsor(@Req() req: Request, @Body() childSponsorShipDTO: ChildSponsorShipDTO): Promise<ChildSponsorShipDTO> {
    const childSponsorshipExists = await this.childSponsorShipService.findByFields({
      where: { child: childSponsorShipDTO.child },
      relations: ['childSponsorShipNotes', 'relSponsershipTypes'],
    });
    // if shildSponsorship exists update it if not create it
    const storedChildSponsorship = await this.childSponsorShipService.save(
      {
        ...childSponsorshipExists,
        ...childSponsorShipDTO,
        childSponsorShipNotes: childSponsorshipExists?.childSponsorShipNotes,
        relSponsershipTypes: childSponsorshipExists?.relSponsershipTypes,
      },
      req.user?.login,
    );
    // // add notes to child sponsorship
    await this.addChildSponsorShipNotes(req, storedChildSponsorship, childSponsorShipDTO);

    // add sponsorShipType to child sponsorship
    await this.addSponsorShipType(req, storedChildSponsorship, childSponsorShipDTO);
    return storedChildSponsorship;
  }

  async addChildSponsorShipNotes(req: Request, storedChildSponsorship: ChildSponsorShipDTO, childSponsorShipDTO: ChildSponsorShipDTO) {
    // add notes to child sponsorship
    for (const childSponsorshipNote of childSponsorShipDTO.childSponsorShipNotes) {
      if (childSponsorshipNote.notes) {
          let note;

          if (childSponsorshipNote.notes.id) {
              if (childSponsorshipNote.notes.note.trim() === "") {
                  await this.childSponsorShipNotesService.deleteById(childSponsorshipNote.id);
                  await this.notesService.deleteById(childSponsorshipNote.notes.id);
              } else {
                  note = await this.notesService.update(childSponsorshipNote.notes, req.user?.login);
              }
          } else if (childSponsorshipNote.notes.note.trim() !== "") {
              note = await this.notesService.save(childSponsorshipNote.notes, req.user?.login);
          }
          if(note){
            childSponsorshipNote.childSponsorShip = storedChildSponsorship;
            childSponsorshipNote.notes = note;
            await this.childSponsorShipNotesService.save(childSponsorshipNote, req.user?.login);

          }

      }
  }
  }
  async addSponsorShipType(req: Request, storedChildSponsorship: ChildSponsorShipDTO, childSponsorShipDTO: ChildSponsorShipDTO) {
      //delete the previous types..
      if(storedChildSponsorship && storedChildSponsorship.relSponsershipTypes && storedChildSponsorship.relSponsershipTypes.length > 0){
        for(const type of storedChildSponsorship.relSponsershipTypes){
          await this.relSponsershipTypesService.deleteById(type.id);
         }
      }

      //save child sponorship..
      for(const sponsorType of childSponsorShipDTO.sponsershipType){
        const type = await this.sponsershipTypesService.findByFields({where:{type:sponsorType}});
        const sponsorShip ={
          childSponsorShip : storedChildSponsorship,
          sponsershipType :type
        }

      await this.relSponsershipTypesService.save(sponsorShip, req.user?.login);

     }

    }


}

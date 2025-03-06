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
import { ChildSponsorShipDTO } from '../../service/dto/child-sponsor-ship.dto';
import { ChildSponsorShipService } from '../../service/child-sponsor-ship.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/child-sponsor-ships')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-sponsor-ships')
export class ChildSponsorShipController {
  logger = new Logger('ChildSponsorShipController');

  constructor(private readonly childSponsorShipService: ChildSponsorShipService) {}

  @Get('/')
  @Roles(RoleType.USER)
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
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildSponsorShipDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildSponsorShipDTO> {
    return await this.childSponsorShipService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create childSponsorShip' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildSponsorShipDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childSponsorShipDTO: ChildSponsorShipDTO): Promise<ChildSponsorShipDTO> {
    const created = await this.childSponsorShipService.save(childSponsorShipDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildSponsorShip', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childSponsorShip' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildSponsorShipDTO,
  })
  async put(@Req() req: Request, @Body() childSponsorShipDTO: ChildSponsorShipDTO): Promise<ChildSponsorShipDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildSponsorShip', childSponsorShipDTO.id);
    return await this.childSponsorShipService.update(childSponsorShipDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update childSponsorShip with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ChildSponsorShipDTO,
  })
  async putId(@Req() req: Request, @Body() childSponsorShipDTO: ChildSponsorShipDTO): Promise<ChildSponsorShipDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ChildSponsorShip', childSponsorShipDTO.id);
    return await this.childSponsorShipService.update(childSponsorShipDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete childSponsorShip' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ChildSponsorShip', id);
    return await this.childSponsorShipService.deleteById(id);
  }
}

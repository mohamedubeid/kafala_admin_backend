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
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ChildTransactionReportsExtendedService } from '../../service/child-transaction-reports.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { ChildTransactionReportsDTO } from '../../service/dto/child-transaction-reports.dto';

@Controller('api/v2/child-transaction-reports')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('child-transaction-reports')
export class ChildTransactionReportsExtendedController {
  logger = new Logger('ChildTransactionReportsExtendedController');

  constructor(private readonly childTransactionReportsExtendedService: ChildTransactionReportsExtendedService) {}

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create childTransactionReports' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChildTransactionReportsDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() childTransactionReportsDTO: ChildTransactionReportsDTO): Promise<ChildTransactionReportsDTO> {
    const created = await this.childTransactionReportsExtendedService.save(childTransactionReportsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'childTransactionReports', created.id);
    return created;
  }
  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildTransactionReportsDTO,
  })
  async getAll(@Req() req: Request): Promise<ChildTransactionReportsDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.childTransactionReportsExtendedService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/admin/:childId')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ChildTransactionReportsDTO,
  })
  async getChildTransactionReports(@Req() req: Request, @Param('childId') childId: number): Promise<ChildTransactionReportsDTO[]> {
    const pageRequest: PageRequest = new PageRequest(
      req.query.page ? req.query.page : req.query.page,
      req.query.size ? req.query.size : req.query.size,
      req.query.sort,
    );
    const { childTransactionReports, count } = await this.childTransactionReportsExtendedService.childTransactionReports(pageRequest, childId);
    HeaderUtil.addPaginationHeaders(req.res, new Page(childTransactionReports, count, pageRequest));
    return childTransactionReports;
  }

  @Get('/:id')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ChildTransactionReportsDTO,
  })
  async getOne(@Param('id') id: number): Promise<ChildTransactionReportsDTO> {
    return await this.childTransactionReportsExtendedService.findById(id);
  }
  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete childTransactionReports' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'childTransactionReports', id);
    return await this.childTransactionReportsExtendedService.deleteById(id);
  }
}

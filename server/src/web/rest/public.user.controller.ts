import { Controller, ClassSerializerInterceptor, Get, Logger, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { UserDTO } from '../../service/dto/user.dto';
import { HeaderUtil } from '../../client/header-util';
import { AuthService } from '../../service/auth.service';

@Controller('api')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('public-user-controller')
export class PublicUserController {
  logger = new Logger('PublicUserController');

  constructor(private readonly authService: AuthService) {}

  @Get('/users')
  @ApiOperation({ summary: 'Get the list of users' })
  @ApiResponse({
    status: 200,
    description: 'List all users records',
    type: UserDTO,
  })
  async getAllPublicUsers(@Req() req: Request): Promise<UserDTO[]> {
    const sortField = req.query.sort;
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
    const [results, count] = await this.authService.getAllUsers({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/authorities')
  @ApiOperation({ summary: 'Get the list of user roles' })
  @ApiResponse({
    status: 200,
    description: 'List all user roles',
    type: 'string',
    isArray: true,
  })
  async getAuthorities(@Req() req: any): Promise<string[]> {
    const authorities = await this.authService.getAllAuthorities();
    const result = authorities.map(a => a.name);
    return result;
  }
}

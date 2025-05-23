import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { UserDTO } from '../../service/dto/user.dto';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { UserService } from '../../service/user.service';

@Controller('api/admin/users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('user-resource')
export class UserController {
  logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get the list of users' })
  @ApiResponse({
    status: 200,
    description: 'List all users',
    type: UserDTO,
  })
  async getAllUsers(@Req() req: Request): Promise<UserDTO[]> {
    const sortField = req.query.sort;
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
    const [results, count] = await this.userService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Post('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(@Req() req: Request, @Body() userDTO: UserDTO): Promise<UserDTO> {
    try {
      // Normalize email by converting to lowercase and removing any whitespace
      userDTO.login = userDTO.login.toLowerCase().trim();
      userDTO.email = userDTO.email.toLowerCase().trim();

      // Check if user exists with same email (case insensitive)
      const existingUser = await this.userService.find({
        where: {
          email: userDTO.email,
        },
      });

      if (existingUser) {
        throw new HttpException('error.emailexists', HttpStatus.BAD_REQUEST);
      }
      userDTO.login = userDTO.email;
      userDTO.password = userDTO.email;
      const created = await this.userService.save(userDTO, req.user?.login, true);
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
      return created;
    } catch (error) {
      if (error.message?.includes('Duplicate entry') && error.message?.includes('jhi_user.UQ_f4c9581c9306bc1986b4d110cc3')) {
        throw new HttpException('error.emailexists', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserDTO,
  })
  async updateUser(@Req() req: Request, @Body() userDTO: UserDTO & { password: string }): Promise<UserDTO> {
    if (!userDTO.password || userDTO.password.trim() === '') {
      delete userDTO.password;
    }
    const userOnDb = await this.userService.find({ where: { login: userDTO.login } });
    let updated = false;
    if (userOnDb && userOnDb.id) {
      userDTO.id = userOnDb.id;
      updated = true;
    } else {
      userDTO.password = userDTO.login;
    }
    const createdOrUpdated = await this.userService.update(userDTO, req.user?.login);
    if (updated) {
      HeaderUtil.addEntityUpdatedHeaders(req.res, 'User', createdOrUpdated.id);
    } else {
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', createdOrUpdated.id);
    }
    return createdOrUpdated;
  }

  @Get('/:login')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserDTO,
  })
  async getUser(@Param('login') loginValue: string): Promise<UserDTO> {
    return await this.userService.find({ where: { login: loginValue } });
  }

  @Delete('/:login')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
    type: UserDTO,
  })
  async deleteUser(@Req() req: Request, @Param('login') loginValue: string): Promise<UserDTO> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'User', loginValue);
    const userToDelete = await this.userService.find({ where: { login: loginValue } });
    return await this.userService.delete(userToDelete);
  }
}

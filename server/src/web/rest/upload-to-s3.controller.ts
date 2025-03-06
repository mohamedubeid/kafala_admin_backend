/* eslint-disable */
import {
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post as PostMethod,
  UseGuards,
  Req,
  UseInterceptors,
  HttpException,
  Get,
  Redirect,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from '../../service/auth.service';
import { UploadService } from '../../service/upload-to-s3.service';
import { parseCookies } from '../../helpers/parseCookies';
import { domainsWhiteList } from '../../helpers/domainsWhiteList';

@Controller('api/uploads')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('uploads')
export class UploadController {
  logger = new Logger('UploadController');
  constructor(
    private readonly uploadService: UploadService,
    private readonly authService: AuthService,
  ) {}

  @PostMethod('files')
  @UseInterceptors(FileInterceptor('file'))
  addPrivateFile(@Req() request: Request): string {
    if (!request.query?.key) {
      throw new HttpException('Missing filePath', 400);
    }
    return this.uploadService.generatePresignedUrl(request.query?.key);
  }

  @Get('files')
  @Roles(RoleType.ADMIN)
  @Redirect(process.env.CLIENT_SERVER, 302)
  async getFile(@Req() request: Request): Promise<any> {
    const cookies = parseCookies(request);
    const key = await this.authService.verifyToken(cookies.streamToken);

    if (!request.query?.key || !domainsWhiteList.includes(request.headers.referer) || !key.username) {
      throw new HttpException('Missing filePath', 400);
    }

    const presignedUrl = this.uploadService.generatePresignedUrlForGetObject(request.query?.key);
    return { url: presignedUrl };
  }
}

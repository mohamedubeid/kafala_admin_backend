import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseDTO } from './base.dto';

/**
 * An User DTO object.
 */
export class UserDTO extends BaseDTO {
  @ApiProperty({ uniqueItems: true, example: 'myuser', description: 'User login' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'MyUser', description: 'User first name', required: false })
  firstName?: string;

  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  lastName?: string;

  @ApiProperty({ example: 'myuser@localhost.it', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'true', description: 'User activation', required: false })
  activated?: boolean;

  @ApiProperty({ example: 'en', description: 'User language', required: false })
  langKey?: string;

  @ApiProperty({
    isArray: true,
    enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS', 'ROLE_GUARANTOR', 'ROLE_CHILD','ROLE_ORGANIZATIONAL','ROLE_APP_MANAGER', 'ROLE_CHILD_GUARDIAN'],
    description: 'Array of permissions',
    required: false,
  })
  authorities?: any[];

  @Exclude()
  @ApiProperty({ example: 'myuser', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'http://my-image-url', description: 'Image url', required: false })
  imageUrl?: string;

  activationKey?: string;

  resetKey?: string;

  resetDate?: Date;
  mobile?: string;
  national_id?:string;
  attachment?:string;
}

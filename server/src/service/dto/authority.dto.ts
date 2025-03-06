import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * An Authority DTO object.
 */
export class AuthorityDTO extends BaseDTO {
  @ApiProperty({ description: 'User Authority' })
  @IsString()
  name: string;
}

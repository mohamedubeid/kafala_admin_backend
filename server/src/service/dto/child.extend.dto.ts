/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { ChildDTO } from './child.dto';

/**
 * A ChildDTO object.
 */
export class ChildExtendedDTO extends ChildDTO {
  @ApiProperty({ description: 'mobile field', required: false })
  @ApiProperty({ example: 'myuser', description: 'User password' })
  password?: string;

  userId?: number;
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

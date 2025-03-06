/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../domain/enumeration/gender';
import { BaseDTO } from './base.dto';

import { ChildNotesDTO } from './child-notes.dto';
import { RelChildKafeelDTO } from './rel-child-kafeel.dto';
import { ChildPrticipationsDTO } from './child-prticipations.dto';
import { ChildHealthStatusDTO } from './child-health-status.dto';
import { ChildMaritalStatusDTO } from './child-marital-status.dto';
import { ChildEducationStatusDTO } from './child-education-status.dto';
import { ChildSponsorShipDTO } from './child-sponsor-ship.dto';

import { UserDTO } from './user.dto';

/**
 * A ChildDTO object.
 */
export class ChildDTO extends BaseDTO {
  @ApiProperty({ description: 'firstName field', required: false })
  firstName: string;

  @ApiProperty({ description: 'imageUrl field', required: false })
  imageUrl: string;

  @ApiProperty({ description: 'nationalId field', required: false })
  nationalId: string;

  @ApiProperty({ description: 'nationalImage field', required: false })
  nationalImage: string;

  @ApiProperty({ description: 'birthCertificate field', required: false })
  birthCertificate: string;

  @ApiProperty({ description: 'email field', required: false })
  email: string;

  @ApiProperty({ description: 'fatherName field', required: false })
  fatherName: string;

  @ApiProperty({ description: 'fatherPhone field', required: false })
  fatherPhone: string;

  @ApiProperty({ description: 'brotherCode field', required: false })
  brotherCode: string;

  @ApiProperty({ description: 'motherName field', required: false })
  motherName: string;

  @ApiProperty({ description: 'familyName field', required: false })
  familyName: string;

  @ApiProperty({ enum: Gender, description: 'gender enum field', required: false })
  gender: Gender;

  @ApiProperty({ description: 'age field', required: false })
  age: number;

  @ApiProperty({ description: 'vedio field', required: false })
  vedio: string;

  @ApiProperty({ description: 'description field', required: false })
  description: any;

  @ApiProperty({ description: 'address field', required: false })
  address: string;

  @ApiProperty({ description: 'score field', required: false })
  score: number;

  @ApiProperty({ type: () => UserDTO, description: 'user relationship' })
  user: UserDTO;

  @ApiProperty({ type: () => ChildNotesDTO, isArray: true, description: 'childNotes relationship' })
  childNotes: ChildNotesDTO[];

  @ApiProperty({ type: () => RelChildKafeelDTO, isArray: true, description: 'relChildKafeels relationship' })
  relChildKafeels: RelChildKafeelDTO[];

  @ApiProperty({ type: () => ChildPrticipationsDTO, isArray: true, description: 'childPrticipations relationship' })
  childPrticipations: ChildPrticipationsDTO[];

  @ApiProperty({ type: () => ChildHealthStatusDTO, description: 'childHealthStatus relationship' })
  childHealthStatus: ChildHealthStatusDTO;

  @ApiProperty({ type: () => ChildMaritalStatusDTO, description: 'childMaritalStatus relationship' })
  childMaritalStatus: ChildMaritalStatusDTO;

  @ApiProperty({ type: () => ChildEducationStatusDTO, description: 'childEducationStatus relationship' })
  childEducationStatus: ChildEducationStatusDTO;

  @ApiProperty({ type: () => ChildSponsorShipDTO, description: 'childSponsorShip relationship' })
  childSponsorShip: ChildSponsorShipDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

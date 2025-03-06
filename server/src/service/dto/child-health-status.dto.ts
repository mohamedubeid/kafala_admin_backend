/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';

import { HealthStatus } from '../../domain/enumeration/health-status';
import { DisabilityTypes } from '../../domain/enumeration/disability-types';
import { MentalIllnessTypes } from '../../domain/enumeration/mental-illness-types';
import { SychologicalHealthTypes } from '../../domain/enumeration/sychological-health-types';
import { ChildHealthNotesDTO } from './child-health-notes.dto';
import { ChildDTO } from './child.dto';
import { BaseDTO } from './base.dto';

/**
 * A ChildHealthStatusDTO object.
 */
export class ChildHealthStatusDTO extends BaseDTO {
  @ApiProperty({ enum: HealthStatus, description: 'healthStatus enum field', required: false })
  healthStatus: HealthStatus;

  @ApiProperty({ description: 'chronicDisease field', required: false })
  chronicDisease: boolean;

  @ApiProperty({ description: 'hasDisability field', required: false })
  hasDisability: boolean;

  @ApiProperty({ enum: DisabilityTypes, description: 'disabilityType enum field', required: false })
  disabilityType: DisabilityTypes;

  @ApiProperty({ description: 'disabilityImage field', required: false })
  disabilityImage: string;

  @ApiProperty({ description: 'hasMentalIllness field', required: false })
  hasMentalIllness: boolean;

  @ApiProperty({ enum: MentalIllnessTypes, description: 'mentalIllnessType enum field', required: false })
  mentalIllnessType: MentalIllnessTypes;

  @ApiProperty({ description: 'mentalIllnessImage field', required: false })
  mentalIllnessImage: string;

  @ApiProperty({ description: 'sychologicalHealth field', required: false })
  sychologicalHealth: boolean;

  @ApiProperty({ enum: SychologicalHealthTypes, description: 'sychologicalHealthType enum field', required: false })
  sychologicalHealthType: SychologicalHealthTypes;

  @ApiProperty({ description: 'sychologicalHealthImage field', required: false })
  sychologicalHealthImage: string;

  @ApiProperty({ description: 'healthReport field', required: false })
  healthReport: string;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  @ApiProperty({ type: () => ChildHealthNotesDTO, isArray: true, description: 'childHealthNotes relationship' })
  childHealthNotes: ChildHealthNotesDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { ChildHealthNotes } from './child-health-notes.entity';
import { HealthStatus } from './enumeration/health-status';
import { DisabilityTypes } from './enumeration/disability-types';
import { MentalIllnessTypes } from './enumeration/mental-illness-types';
import { SychologicalHealthTypes } from './enumeration/sychological-health-types';

/**
 * A ChildHealthStatus.
 */
@Entity('child_health_status')
export class ChildHealthStatus extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'health_status', enum: HealthStatus })
  healthStatus: HealthStatus;

  @Column({ type: 'boolean', name: 'chronic_disease', nullable: true })
  chronicDisease: boolean;

  @Column({ type: 'boolean', name: 'has_disability', nullable: true })
  hasDisability: boolean;

  @Column({ type: 'simple-enum', name: 'disability_type', enum: DisabilityTypes })
  disabilityType: DisabilityTypes;

  @Column({ name: 'disability_image', nullable: true })
  disabilityImage: string;

  @Column({ type: 'boolean', name: 'has_mental_illness', nullable: true })
  hasMentalIllness: boolean;

  @Column({ type: 'simple-enum', name: 'mental_illness_type', enum: MentalIllnessTypes })
  mentalIllnessType: MentalIllnessTypes;

  @Column({ name: 'mental_illness_image', nullable: true })
  mentalIllnessImage: string;

  @Column({ type: 'boolean', name: 'sychological_health', nullable: true })
  sychologicalHealth: boolean;

  @Column({ type: 'simple-enum', name: 'sychological_health_type', enum: SychologicalHealthTypes })
  sychologicalHealthType: SychologicalHealthTypes;

  @Column({ name: 'sychological_health_image', nullable: true })
  sychologicalHealthImage: string;

  @Column({ name: 'health_report', nullable: true })
  healthReport: string;

  @OneToOne(type => Child)
  @JoinColumn()
  child: Child;

  @OneToMany(type => ChildHealthNotes, other => other.childHealthStatus)
  childHealthNotes: ChildHealthNotes[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

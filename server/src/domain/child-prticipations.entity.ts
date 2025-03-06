/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { ParticipationTypes } from './enumeration/participation-types';

/**
 * A ChildPrticipations.
 */
@Entity('child_prticipations')
export class ChildPrticipations extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'participation_type', enum: ParticipationTypes })
  participationType: ParticipationTypes;

  @Column({ name: 'image', nullable: true })
  image: string;

  @Column({ name: 'desceription', nullable: true })
  desceription: string;

  @ManyToOne(type => Child)
  child: Child;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { ChildEducationNotes } from './child-education-notes.entity';
import { LastLevelOfEducation } from './enumeration/last-level-of-education';

/**
 * A ChildEducationStatus.
 */
@Entity('child_education_status')
export class ChildEducationStatus extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'last_level_of_education', enum: LastLevelOfEducation })
  lastLevelOfEducation: LastLevelOfEducation;

  @Column({ name: 'hoppy', nullable: true })
  hoppy: string;

  @Column({ name: 'last_level_of_education_image', nullable: true })
  lastLevelOfEducationImage: string;

  @OneToOne(type => Child)
  @JoinColumn()
  child: Child;

  @OneToMany(type => ChildEducationNotes, other => other.childEducationStatus)
  childEducationNotes: ChildEducationNotes[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

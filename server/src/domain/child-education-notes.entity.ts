/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Notes } from './notes.entity';
import { ChildEducationStatus } from './child-education-status.entity';

/**
 * A ChildEducationNotes.
 */
@Entity('child_education_notes')
export class ChildEducationNotes extends BaseEntity {
  @OneToOne(type => Notes)
  @JoinColumn()
  notes: Notes;

  @ManyToOne(type => ChildEducationStatus)
  childEducationStatus: ChildEducationStatus;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

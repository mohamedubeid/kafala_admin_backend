/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Notes } from './notes.entity';
import { ChildMaritalStatus } from './child-marital-status.entity';

/**
 * A ChildMaritalNotes.
 */
@Entity('child_marital_notes')
export class ChildMaritalNotes extends BaseEntity {
  @OneToOne(type => Notes)
  @JoinColumn()
  notes: Notes;

  @ManyToOne(type => ChildMaritalStatus)
  childMaritalStatus: ChildMaritalStatus;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

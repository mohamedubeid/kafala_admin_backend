/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Notes } from './notes.entity';
import { Child } from './child.entity';

/**
 * A ChildNotes.
 */
@Entity('child_notes')
export class ChildNotes extends BaseEntity {
  @OneToOne(type => Notes)
  @JoinColumn()
  notes: Notes;

  @ManyToOne(type => Child)
  child: Child;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

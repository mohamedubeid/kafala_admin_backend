/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Notes } from './notes.entity';
import { ChildHealthStatus } from './child-health-status.entity';

/**
 * A ChildHealthNotes.
 */
@Entity('child_health_notes')
export class ChildHealthNotes extends BaseEntity {
  @OneToOne(type => Notes)
  @JoinColumn()
  notes: Notes;

  @ManyToOne(type => ChildHealthStatus)
  childHealthStatus: ChildHealthStatus;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

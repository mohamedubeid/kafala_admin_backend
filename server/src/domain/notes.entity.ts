/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ChildHealthNotes } from './child-health-notes.entity';
import { ChildMaritalNotes } from './child-marital-notes.entity';
import { ChildEducationNotes } from './child-education-notes.entity';
import { ChildSponsorShipNotes } from './child-sponsor-ship-notes.entity';
import { ChildNotes } from './child-notes.entity';

/**
 * A Notes.
 */
@Entity('notes')
export class Notes extends BaseEntity {
  @Column({ type: 'blob', name: 'note', nullable: true })
  note: any;

  @OneToOne(type => ChildHealthNotes)
  childHealthNotes: ChildHealthNotes;

  @OneToOne(type => ChildMaritalNotes)
  childMaritalNotes: ChildMaritalNotes;

  @OneToOne(type => ChildEducationNotes)
  childEducationNotes: ChildEducationNotes;

  @OneToOne(type => ChildSponsorShipNotes)
  childSponsorShipNotes: ChildSponsorShipNotes;

  @OneToOne(type => ChildNotes)
  childNotes: ChildNotes;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Setting.
 */
@Entity('setting')
export class Setting extends BaseEntity {
  @Column({ name: 'jhi_key', nullable: true })
  key: string;

  @Column({ type: 'blob', name: 'value', nullable: true })
  value: any;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

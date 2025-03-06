import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-education-notes.reducer';

export const ChildEducationNotesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childEducationNotesEntity = useAppSelector(state => state.childEducationNotes.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childEducationNotesDetailsHeading">
          <Translate contentKey="kafalaApp.childEducationNotes.detail.title">ChildEducationNotes</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childEducationNotesEntity.id}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childEducationNotes.notes">Notes</Translate>
          </dt>
          <dd>{childEducationNotesEntity.notes ? childEducationNotesEntity.notes.id : ''}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childEducationNotes.childEducationStatus">Child Education Status</Translate>
          </dt>
          <dd>{childEducationNotesEntity.childEducationStatus ? childEducationNotesEntity.childEducationStatus.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-education-notes" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-education-notes/${childEducationNotesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildEducationNotesDetail;

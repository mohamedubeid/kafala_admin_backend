import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-health-notes.reducer';

export const ChildHealthNotesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childHealthNotesEntity = useAppSelector(state => state.childHealthNotes.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childHealthNotesDetailsHeading">
          <Translate contentKey="kafalaApp.childHealthNotes.detail.title">ChildHealthNotes</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childHealthNotesEntity.id}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childHealthNotes.notes">Notes</Translate>
          </dt>
          <dd>{childHealthNotesEntity.notes ? childHealthNotesEntity.notes.id : ''}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childHealthNotes.childHealthStatus">Child Health Status</Translate>
          </dt>
          <dd>{childHealthNotesEntity.childHealthStatus ? childHealthNotesEntity.childHealthStatus.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-health-notes" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-health-notes/${childHealthNotesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildHealthNotesDetail;

import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-notes.reducer';

export const ChildNotesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childNotesEntity = useAppSelector(state => state.childNotes.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childNotesDetailsHeading">
          <Translate contentKey="kafalaApp.childNotes.detail.title">ChildNotes</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childNotesEntity.id}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childNotes.notes">Notes</Translate>
          </dt>
          <dd>{childNotesEntity.notes ? childNotesEntity.notes.id : ''}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childNotes.child">Child</Translate>
          </dt>
          <dd>{childNotesEntity.child ? childNotesEntity.child.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-notes" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-notes/${childNotesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildNotesDetail;

import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-sponsor-ship-notes.reducer';

export const ChildSponsorShipNotesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childSponsorShipNotesEntity = useAppSelector(state => state.childSponsorShipNotes.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childSponsorShipNotesDetailsHeading">
          <Translate contentKey="kafalaApp.childSponsorShipNotes.detail.title">ChildSponsorShipNotes</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipNotesEntity.id}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childSponsorShipNotes.notes">Notes</Translate>
          </dt>
          <dd>{childSponsorShipNotesEntity.notes ? childSponsorShipNotesEntity.notes.id : ''}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childSponsorShipNotes.childSponsorShip">Child Sponsor Ship</Translate>
          </dt>
          <dd>{childSponsorShipNotesEntity.childSponsorShip ? childSponsorShipNotesEntity.childSponsorShip.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-sponsor-ship-notes" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-sponsor-ship-notes/${childSponsorShipNotesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildSponsorShipNotesDetail;

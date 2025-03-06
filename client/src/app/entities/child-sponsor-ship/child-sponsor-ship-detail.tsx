import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-sponsor-ship.reducer';

export const ChildSponsorShipDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childSponsorShipEntity = useAppSelector(state => state.childSponsorShip.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childSponsorShipDetailsHeading">
          <Translate contentKey="kafalaApp.childSponsorShip.detail.title">ChildSponsorShip</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="kafalaApp.childSponsorShip.name">Name</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipEntity.name}</dd>
          <dt>
            <span id="sponserConnection">
              <Translate contentKey="kafalaApp.childSponsorShip.sponserConnection">Sponser Connection</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipEntity.sponserConnection}</dd>
          <dt>
            <span id="sponsershipParty">
              <Translate contentKey="kafalaApp.childSponsorShip.sponsershipParty">Sponsership Party</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipEntity.sponsershipParty}</dd>
          <dt>
            <span id="sponsershipDuration">
              <Translate contentKey="kafalaApp.childSponsorShip.sponsershipDuration">Sponsership Duration</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipEntity.sponsershipDuration}</dd>
          <dt>
            <span id="minimumCost">
              <Translate contentKey="kafalaApp.childSponsorShip.minimumCost">Minimum Cost</Translate>
            </span>
          </dt>
          <dd>{childSponsorShipEntity.minimumCost}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childSponsorShip.child">Child</Translate>
          </dt>
          <dd>{childSponsorShipEntity.child ? childSponsorShipEntity.child.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-sponsor-ship" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-sponsor-ship/${childSponsorShipEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildSponsorShipDetail;

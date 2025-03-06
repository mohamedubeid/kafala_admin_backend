import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './rel-sponsership-types.reducer';

export const RelSponsershipTypesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const relSponsershipTypesEntity = useAppSelector(state => state.relSponsershipTypes.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="relSponsershipTypesDetailsHeading">
          <Translate contentKey="kafalaApp.relSponsershipTypes.detail.title">RelSponsershipTypes</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{relSponsershipTypesEntity.id}</dd>
          <dt>
            <Translate contentKey="kafalaApp.relSponsershipTypes.sponsershipType">Sponsership Type</Translate>
          </dt>
          <dd>{relSponsershipTypesEntity.sponsershipType ? relSponsershipTypesEntity.sponsershipType.id : ''}</dd>
          <dt>
            <Translate contentKey="kafalaApp.relSponsershipTypes.childSponsorShip">Child Sponsor Ship</Translate>
          </dt>
          <dd>{relSponsershipTypesEntity.childSponsorShip ? relSponsershipTypesEntity.childSponsorShip.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/rel-sponsership-types" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/rel-sponsership-types/${relSponsershipTypesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default RelSponsershipTypesDetail;

import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './sponsership-types.reducer';

export const SponsershipTypesDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const sponsershipTypesEntity = useAppSelector(state => state.sponsershipTypes.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="sponsershipTypesDetailsHeading">
          <Translate contentKey="kafalaApp.sponsershipTypes.detail.title">SponsershipTypes</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{sponsershipTypesEntity.id}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="kafalaApp.sponsershipTypes.type">Type</Translate>
            </span>
          </dt>
          <dd>{sponsershipTypesEntity.type}</dd>
        </dl>
        <Button tag={Link} to="/sponsership-types" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/sponsership-types/${sponsershipTypesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SponsershipTypesDetail;

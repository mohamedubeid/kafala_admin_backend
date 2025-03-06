import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISponsershipTypes } from 'app/shared/model/sponsership-types.model';
import { getEntities as getSponsershipTypes } from 'app/entities/sponsership-types/sponsership-types.reducer';
import { IChildSponsorShip } from 'app/shared/model/child-sponsor-ship.model';
import { getEntities as getChildSponsorShips } from 'app/entities/child-sponsor-ship/child-sponsor-ship.reducer';
import { IRelSponsershipTypes } from 'app/shared/model/rel-sponsership-types.model';
import { getEntity, updateEntity, createEntity, reset } from './rel-sponsership-types.reducer';

export const RelSponsershipTypesUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const sponsershipTypes = useAppSelector(state => state.sponsershipTypes.entities);
  const childSponsorShips = useAppSelector(state => state.childSponsorShip.entities);
  const relSponsershipTypesEntity = useAppSelector(state => state.relSponsershipTypes.entity);
  const loading = useAppSelector(state => state.relSponsershipTypes.loading);
  const updating = useAppSelector(state => state.relSponsershipTypes.updating);
  const updateSuccess = useAppSelector(state => state.relSponsershipTypes.updateSuccess);

  const handleClose = () => {
    navigate('/rel-sponsership-types');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getSponsershipTypes({}));
    dispatch(getChildSponsorShips({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...relSponsershipTypesEntity,
      ...values,
      sponsershipType: sponsershipTypes.find(it => it.id.toString() === values.sponsershipType?.toString()),
      childSponsorShip: childSponsorShips.find(it => it.id.toString() === values.childSponsorShip?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...relSponsershipTypesEntity,
          sponsershipType: relSponsershipTypesEntity?.sponsershipType?.id,
          childSponsorShip: relSponsershipTypesEntity?.childSponsorShip?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.relSponsershipTypes.home.createOrEditLabel" data-cy="RelSponsershipTypesCreateUpdateHeading">
            <Translate contentKey="kafalaApp.relSponsershipTypes.home.createOrEditLabel">Create or edit a RelSponsershipTypes</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="rel-sponsership-types-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="rel-sponsership-types-sponsershipType"
                name="sponsershipType"
                data-cy="sponsershipType"
                label={translate('kafalaApp.relSponsershipTypes.sponsershipType')}
                type="select"
              >
                <option value="" key="0" />
                {sponsershipTypes
                  ? sponsershipTypes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="rel-sponsership-types-childSponsorShip"
                name="childSponsorShip"
                data-cy="childSponsorShip"
                label={translate('kafalaApp.relSponsershipTypes.childSponsorShip')}
                type="select"
              >
                <option value="" key="0" />
                {childSponsorShips
                  ? childSponsorShips.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/rel-sponsership-types" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RelSponsershipTypesUpdate;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IChild } from 'app/shared/model/child.model';
import { getEntities as getChildren } from 'app/entities/child/child.reducer';
import { IChildSponsorShip } from 'app/shared/model/child-sponsor-ship.model';
import { SponserConnection } from 'app/shared/model/enumerations/sponser-connection.model';
import { SponsershipParty } from 'app/shared/model/enumerations/sponsership-party.model';
import { SponsershipDuration } from 'app/shared/model/enumerations/sponsership-duration.model';
import { getEntity, updateEntity, createEntity, reset } from './child-sponsor-ship.reducer';

export const ChildSponsorShipUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childSponsorShipEntity = useAppSelector(state => state.childSponsorShip.entity);
  const loading = useAppSelector(state => state.childSponsorShip.loading);
  const updating = useAppSelector(state => state.childSponsorShip.updating);
  const updateSuccess = useAppSelector(state => state.childSponsorShip.updateSuccess);
  const sponserConnectionValues = Object.keys(SponserConnection);
  const sponsershipPartyValues = Object.keys(SponsershipParty);
  const sponsershipDurationValues = Object.keys(SponsershipDuration);

  const handleClose = () => {
    navigate('/child-sponsor-ship');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getChildren({}));
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
    if (values.minimumCost !== undefined && typeof values.minimumCost !== 'number') {
      values.minimumCost = Number(values.minimumCost);
    }

    const entity = {
      ...childSponsorShipEntity,
      ...values,
      child: children.find(it => it.id.toString() === values.child?.toString()),
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
          sponserConnection: 'DIRECT',
          sponsershipParty: 'INDIVIDUAL',
          sponsershipDuration: 'SHORT_TERM',
          ...childSponsorShipEntity,
          child: childSponsorShipEntity?.child?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childSponsorShip.home.createOrEditLabel" data-cy="ChildSponsorShipCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childSponsorShip.home.createOrEditLabel">Create or edit a ChildSponsorShip</Translate>
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
                  id="child-sponsor-ship-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.childSponsorShip.name')}
                id="child-sponsor-ship-name"
                name="name"
                data-cy="name"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childSponsorShip.sponserConnection')}
                id="child-sponsor-ship-sponserConnection"
                name="sponserConnection"
                data-cy="sponserConnection"
                type="select"
              >
                {sponserConnectionValues.map(sponserConnection => (
                  <option value={sponserConnection} key={sponserConnection}>
                    {translate('kafalaApp.SponserConnection.' + sponserConnection)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childSponsorShip.sponsershipParty')}
                id="child-sponsor-ship-sponsershipParty"
                name="sponsershipParty"
                data-cy="sponsershipParty"
                type="select"
              >
                {sponsershipPartyValues.map(sponsershipParty => (
                  <option value={sponsershipParty} key={sponsershipParty}>
                    {translate('kafalaApp.SponsershipParty.' + sponsershipParty)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childSponsorShip.sponsershipDuration')}
                id="child-sponsor-ship-sponsershipDuration"
                name="sponsershipDuration"
                data-cy="sponsershipDuration"
                type="select"
              >
                {sponsershipDurationValues.map(sponsershipDuration => (
                  <option value={sponsershipDuration} key={sponsershipDuration}>
                    {translate('kafalaApp.SponsershipDuration.' + sponsershipDuration)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childSponsorShip.minimumCost')}
                id="child-sponsor-ship-minimumCost"
                name="minimumCost"
                data-cy="minimumCost"
                type="text"
              />
              <ValidatedField
                id="child-sponsor-ship-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childSponsorShip.child')}
                type="select"
              >
                <option value="" key="0" />
                {children
                  ? children.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-sponsor-ship" replace color="info">
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

export default ChildSponsorShipUpdate;

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
import { IChildPrticipations } from 'app/shared/model/child-prticipations.model';
import { ParticipationTypes } from 'app/shared/model/enumerations/participation-types.model';
import { getEntity, updateEntity, createEntity, reset } from './child-prticipations.reducer';

export const ChildPrticipationsUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childPrticipationsEntity = useAppSelector(state => state.childPrticipations.entity);
  const loading = useAppSelector(state => state.childPrticipations.loading);
  const updating = useAppSelector(state => state.childPrticipations.updating);
  const updateSuccess = useAppSelector(state => state.childPrticipations.updateSuccess);
  const participationTypesValues = Object.keys(ParticipationTypes);

  const handleClose = () => {
    navigate('/child-prticipations');
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

    const entity = {
      ...childPrticipationsEntity,
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
          participationType: 'ACHEIVEMENT',
          ...childPrticipationsEntity,
          child: childPrticipationsEntity?.child?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childPrticipations.home.createOrEditLabel" data-cy="ChildPrticipationsCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childPrticipations.home.createOrEditLabel">Create or edit a ChildPrticipations</Translate>
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
                  id="child-prticipations-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.childPrticipations.participationType')}
                id="child-prticipations-participationType"
                name="participationType"
                data-cy="participationType"
                type="select"
              >
                {participationTypesValues.map(participationTypes => (
                  <option value={participationTypes} key={participationTypes}>
                    {translate('kafalaApp.ParticipationTypes.' + participationTypes)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childPrticipations.image')}
                id="child-prticipations-image"
                name="image"
                data-cy="image"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childPrticipations.desceription')}
                id="child-prticipations-desceription"
                name="desceription"
                data-cy="desceription"
                type="text"
              />
              <ValidatedField
                id="child-prticipations-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childPrticipations.child')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-prticipations" replace color="info">
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

export default ChildPrticipationsUpdate;

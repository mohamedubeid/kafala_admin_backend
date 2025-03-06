import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { INotes } from 'app/shared/model/notes.model';
import { getEntities as getNotes } from 'app/entities/notes/notes.reducer';
import { IChildHealthStatus } from 'app/shared/model/child-health-status.model';
import { getEntities as getChildHealthStatuses } from 'app/entities/child-health-status/child-health-status.reducer';
import { IChildHealthNotes } from 'app/shared/model/child-health-notes.model';
import { getEntity, updateEntity, createEntity, reset } from './child-health-notes.reducer';

export const ChildHealthNotesUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notes = useAppSelector(state => state.notes.entities);
  const childHealthStatuses = useAppSelector(state => state.childHealthStatus.entities);
  const childHealthNotesEntity = useAppSelector(state => state.childHealthNotes.entity);
  const loading = useAppSelector(state => state.childHealthNotes.loading);
  const updating = useAppSelector(state => state.childHealthNotes.updating);
  const updateSuccess = useAppSelector(state => state.childHealthNotes.updateSuccess);

  const handleClose = () => {
    navigate('/child-health-notes');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotes({}));
    dispatch(getChildHealthStatuses({}));
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
      ...childHealthNotesEntity,
      ...values,
      notes: notes.find(it => it.id.toString() === values.notes?.toString()),
      childHealthStatus: childHealthStatuses.find(it => it.id.toString() === values.childHealthStatus?.toString()),
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
          ...childHealthNotesEntity,
          notes: childHealthNotesEntity?.notes?.id,
          childHealthStatus: childHealthNotesEntity?.childHealthStatus?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childHealthNotes.home.createOrEditLabel" data-cy="ChildHealthNotesCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childHealthNotes.home.createOrEditLabel">Create or edit a ChildHealthNotes</Translate>
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
                  id="child-health-notes-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="child-health-notes-notes"
                name="notes"
                data-cy="notes"
                label={translate('kafalaApp.childHealthNotes.notes')}
                type="select"
              >
                <option value="" key="0" />
                {notes
                  ? notes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="child-health-notes-childHealthStatus"
                name="childHealthStatus"
                data-cy="childHealthStatus"
                label={translate('kafalaApp.childHealthNotes.childHealthStatus')}
                type="select"
              >
                <option value="" key="0" />
                {childHealthStatuses
                  ? childHealthStatuses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-health-notes" replace color="info">
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

export default ChildHealthNotesUpdate;

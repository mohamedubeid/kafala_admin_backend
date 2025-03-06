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
import { IChildMaritalStatus } from 'app/shared/model/child-marital-status.model';
import { getEntities as getChildMaritalStatuses } from 'app/entities/child-marital-status/child-marital-status.reducer';
import { IChildMaritalNotes } from 'app/shared/model/child-marital-notes.model';
import { getEntity, updateEntity, createEntity, reset } from './child-marital-notes.reducer';

export const ChildMaritalNotesUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notes = useAppSelector(state => state.notes.entities);
  const childMaritalStatuses = useAppSelector(state => state.childMaritalStatus.entities);
  const childMaritalNotesEntity = useAppSelector(state => state.childMaritalNotes.entity);
  const loading = useAppSelector(state => state.childMaritalNotes.loading);
  const updating = useAppSelector(state => state.childMaritalNotes.updating);
  const updateSuccess = useAppSelector(state => state.childMaritalNotes.updateSuccess);

  const handleClose = () => {
    navigate('/child-marital-notes');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotes({}));
    dispatch(getChildMaritalStatuses({}));
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
      ...childMaritalNotesEntity,
      ...values,
      notes: notes.find(it => it.id.toString() === values.notes?.toString()),
      childMaritalStatus: childMaritalStatuses.find(it => it.id.toString() === values.childMaritalStatus?.toString()),
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
          ...childMaritalNotesEntity,
          notes: childMaritalNotesEntity?.notes?.id,
          childMaritalStatus: childMaritalNotesEntity?.childMaritalStatus?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childMaritalNotes.home.createOrEditLabel" data-cy="ChildMaritalNotesCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childMaritalNotes.home.createOrEditLabel">Create or edit a ChildMaritalNotes</Translate>
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
                  id="child-marital-notes-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="child-marital-notes-notes"
                name="notes"
                data-cy="notes"
                label={translate('kafalaApp.childMaritalNotes.notes')}
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
                id="child-marital-notes-childMaritalStatus"
                name="childMaritalStatus"
                data-cy="childMaritalStatus"
                label={translate('kafalaApp.childMaritalNotes.childMaritalStatus')}
                type="select"
              >
                <option value="" key="0" />
                {childMaritalStatuses
                  ? childMaritalStatuses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-marital-notes" replace color="info">
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

export default ChildMaritalNotesUpdate;

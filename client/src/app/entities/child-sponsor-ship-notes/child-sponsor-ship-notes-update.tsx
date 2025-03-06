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
import { IChildSponsorShip } from 'app/shared/model/child-sponsor-ship.model';
import { getEntities as getChildSponsorShips } from 'app/entities/child-sponsor-ship/child-sponsor-ship.reducer';
import { IChildSponsorShipNotes } from 'app/shared/model/child-sponsor-ship-notes.model';
import { getEntity, updateEntity, createEntity, reset } from './child-sponsor-ship-notes.reducer';

export const ChildSponsorShipNotesUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notes = useAppSelector(state => state.notes.entities);
  const childSponsorShips = useAppSelector(state => state.childSponsorShip.entities);
  const childSponsorShipNotesEntity = useAppSelector(state => state.childSponsorShipNotes.entity);
  const loading = useAppSelector(state => state.childSponsorShipNotes.loading);
  const updating = useAppSelector(state => state.childSponsorShipNotes.updating);
  const updateSuccess = useAppSelector(state => state.childSponsorShipNotes.updateSuccess);

  const handleClose = () => {
    navigate('/child-sponsor-ship-notes');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotes({}));
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
      ...childSponsorShipNotesEntity,
      ...values,
      notes: notes.find(it => it.id.toString() === values.notes?.toString()),
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
          ...childSponsorShipNotesEntity,
          notes: childSponsorShipNotesEntity?.notes?.id,
          childSponsorShip: childSponsorShipNotesEntity?.childSponsorShip?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childSponsorShipNotes.home.createOrEditLabel" data-cy="ChildSponsorShipNotesCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childSponsorShipNotes.home.createOrEditLabel">
              Create or edit a ChildSponsorShipNotes
            </Translate>
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
                  id="child-sponsor-ship-notes-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="child-sponsor-ship-notes-notes"
                name="notes"
                data-cy="notes"
                label={translate('kafalaApp.childSponsorShipNotes.notes')}
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
                id="child-sponsor-ship-notes-childSponsorShip"
                name="childSponsorShip"
                data-cy="childSponsorShip"
                label={translate('kafalaApp.childSponsorShipNotes.childSponsorShip')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-sponsor-ship-notes" replace color="info">
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

export default ChildSponsorShipNotesUpdate;

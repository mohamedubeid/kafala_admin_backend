import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SponserConnection } from 'app/shared/model/enumerations/sponser-connection.model';
import { SponsershipDuration } from 'app/shared/model/enumerations/sponsership-duration.model';
import { SponsershipParty } from 'app/shared/model/enumerations/sponsership-party.model';
import { ValidatedForm, ValidatedField, translate } from 'react-jhipster';
import { useNavigate, useParams } from 'react-router';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import { getEntity, createEntity, reset } from '../../child-sponsor-ship-extend/child-sponsor-ship.reducer';
import { reset as resetChild } from '../child.reducer';
import { getEntity as getChildEntity } from '../../child-extend/child.reducer';
import { IChild } from 'app/shared/model/child.model';
import { toast } from 'react-toastify';

type ChildEducationProps = {
  child: IChild;
  handleNext: () => void;
};

const StepFive = ({ child, handleNext }: ChildEducationProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const childSponsorShipEntity = useAppSelector(state => state.childSponsorShip.entity);
  const updateSuccess = useAppSelector(state => state.childSponsorShip.updateSuccess);
  const sponserConnectionValues = Object.keys(SponserConnection);
  const sponsershipPartyValues = Object.keys(SponsershipParty);
  const childEntity = useAppSelector(state => state.child.entity);

  const [notes, setNotes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [textBoxApper, setTextBoxAppear] = useState(false);

  useEffect(() => {
    setNotes([]);
    if (notes.length === 0) {
      setNotes([{ id: null, notes: { id: null, note: '' } }]);
    } else if (!textBoxApper) {
      setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
      setTextBoxAppear(true);
    }
  }, []);

  useEffect(() => {
    if (
      !isNew &&
      childSponsorShipEntity &&
      childSponsorShipEntity.childSponsorShipNotes &&
      childSponsorShipEntity.childSponsorShipNotes?.length > 0
    ) {
      const updatedNotes = childSponsorShipEntity.childSponsorShipNotes.map(childNote => ({
        id: childNote?.id,
        notes: { id: childNote.notes?.id, note: childNote.notes?.note },
      }));
      setNotes(updatedNotes);
    } else if (!textBoxApper) {
      setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
      setTextBoxAppear(true);
    }
  }, [childSponsorShipEntity]);

  useEffect(() => {
    if (childSponsorShipEntity && childSponsorShipEntity.relSponsershipTypes) {
      const selectedTypesFromResponse = childSponsorShipEntity.relSponsershipTypes.map(sponsorType => ({
        id: sponsorType?.id,
        sponsershipType: { id: sponsorType.sponsershipType?.id, type: sponsorType.sponsershipType?.type },
      }));
      setSelectedTypes(selectedTypesFromResponse);
    }
  }, [childSponsorShipEntity]);

  const handleAddNote = () => {
    setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
  };

  const handleNoteChange = (index, event) => {
    const newNotes = [...notes];
    if (!newNotes[index]) {
      newNotes[index] = { id: null, notes: { id: null, note: '' } };
    }
    newNotes[index].notes.note = event.target.value;
    setNotes(newNotes);
  };

  const sponorShipTypes = [
    { id: 1, type: 'HEALTH' },
    { id: 2, type: 'SOCIAL' },
    { id: 3, type: 'FINANCIAL' },
    { id: 4, type: 'EDUCATIONAL' },
    { id: 5, type: 'OTHER' },
  ];

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getChildEntity(id));
    }
  }, []);

  useEffect(() => {
    if (!isNew && childEntity && childEntity.childSponsorShip) {
      dispatch(getEntity(childEntity.childSponsorShip.id));
    }
  }, [childEntity]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(translate('kafala.Child.saved'));
      dispatch(reset());
      handleNext();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...childSponsorShipEntity,
      ...values,
      child: child,
      minimumCost: values.minimumCost * 12,
      childSponsorShipNotes: notes.map(childNote => ({
        id: childNote.id,
        notes: {
          id: childNote.notes.id,
          note: childNote.notes.note,
        },
      })),
      relSponsershipTypes: selectedTypes.map(sponsorType => ({
        id: sponsorType.id,
        sponsershipType: {
          id: sponsorType.sponsershipType.id,
          type: sponsorType.sponsershipType.type,
        },
      })),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      entity.id = childSponsorShipEntity.id;
      dispatch(createEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? { SponsershipDuration: translate('kafalaApp.childSponsorShip.ANNUAL') }
      : {
          sponserConnection: 'DIRECT',
          sponsershipParty: 'INDIVIDUAL',
          ...childSponsorShipEntity,
          minimumCost: childSponsorShipEntity.minimumCost / 12,
          child: childSponsorShipEntity?.child?.id,
          SponsershipDuration: translate('kafalaApp.childSponsorShip.ANNUAL'),
          sponsershipType: selectedTypes.map(type => type.sponsershipType.type),
        };

  return (
    <div className="stepContainer">
      <ValidatedForm id="sponsorForm" defaultValues={defaultValues()} onSubmit={saveEntity}>
        <ValidatedField
          label={`${translate('kafalaApp.childSponsorShip.name')} *`}
          id="child-sponsor-ship-name"
          name="name"
          data-cy="name"
          type="text"
          validate={{ required: true }}
        />
        <ValidatedField
          label={`${translate('kafalaApp.childSponsorShip.sponserConnection')}*`}
          id="child-sponsor-ship-sponserConnection"
          name="sponserConnection"
          data-cy="sponserConnection"
          type="select"
          validate={{ required: true }}
        >
          {sponserConnectionValues.map(sponserConnection => (
            <option value={sponserConnection} key={sponserConnection}>
              {translate('kafalaApp.SponserConnection.' + sponserConnection)}
            </option>
          ))}
        </ValidatedField>
        {/* <ValidatedField
          label={translate('kafalaApp.childSponsorShip.sponsershipParty')}
          id="child-sponsor-ship-sponsershipParty"
          name="sponsershipParty"
          data-cy="sponsershipParty"
          type="select"
          validate={{ required: true }}
        >
          {sponsershipPartyValues.map(sponsershipParty => (
            <option value={sponsershipParty} key={sponsershipParty}>
              {translate('kafalaApp.SponsershipParty.' + sponsershipParty)}
            </option>
          ))}
        </ValidatedField> */}
        <ValidatedField
          label={`${translate('kafalaApp.childSponsorShip.sponsershipDuration')} *`}
          id="child-sponsor-ship-sponsershipDuration"
          name="SponsershipDuration"
          data-cy="sponsershipDuration"
          type="text"
          readOnly={true}
          value={translate(`kafalaApp.childSponsorShip.ANNUAL`)}
          validate={{ required: true }}
        ></ValidatedField>
        <ValidatedField
          id="rel-sponsership-types-sponsershipType"
          name="sponsershipType"
          data-cy="sponsershipType"
          label={`${translate('kafalaApp.relSponsershipTypes.sponsershipType')} *`}
          type="select"
          multiple
          validate={{ required: true }}
        >
          {sponorShipTypes.map(type => (
            <option value={type.type} key={type.id}>
              {translate(`kafalaApp.SponsershipType.${type.type}`)}
            </option>
          ))}
        </ValidatedField>
        <ValidatedField
          label={`${translate('kafalaApp.childSponsorShip.minimumCost')} *`}
          id="child-sponsor-ship-minimumCost"
          name="minimumCost"
          data-cy="minimumCost"
          type="text"
          validate={{ required: true }}
        />
        <Row className="mt-1">
          <Row className="mt-1">
            <Col xs="12">
              <FormGroup>
                <Label>{translate('kafalaApp.child.childNotes')}</Label>
                {notes.map((note, index) => (
                  <Input type="textarea" key={index} value={note.notes.note} onChange={e => handleNoteChange(index, e)} className="mb-2" />
                ))}
              </FormGroup>
              <Button type="button" className="add-note-btn" onClick={handleAddNote}>
                {translate('kafalaApp.child.newNote')}
              </Button>
            </Col>
            <Col xs="12" className="mt-3">
              <FormGroup className="correctInfoGroup">
                <Input id="correctInfo" name="correctInfo" type="checkbox" />{' '}
                <Label className="ms-2">
                  {translate('kafalaApp.child.correctData')}
                  <Button type="button">{translate('kafalaApp.child.knowMore')}</Button>
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </Row>
      </ValidatedForm>
    </div>
  );
};

export default StepFive;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText, FormGroup, Label, Input } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity as getChildEntity } from '../../child-extend/child.reducer';

import { IChild } from 'app/shared/model/child.model';
import { HealthStatus } from 'app/shared/model/enumerations/health-status.model';
import { DisabilityTypes } from 'app/shared/model/enumerations/disability-types.model';
import { MentalIllnessTypes } from 'app/shared/model/enumerations/mental-illness-types.model';
import { SychologicalHealthTypes } from 'app/shared/model/enumerations/sychological-health-types.model';
import { getEntity, updateEntity, createEntity, reset } from '../../child-health-status-extend/child-health-status.reducer';
import { toast } from 'react-toastify';
import UploadImage from 'app/shared/upload/upload-file';
type ChildHealthProps = {
  child: IChild;
  handleNext: () => void;
};
const StepTwo = ({ child, handleNext }: ChildHealthProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const childEntity = useAppSelector(state => state.child.entity);
  const childHealthStatusEntity = useAppSelector(state => state.childHealthStatus.entity);
  const loading = useAppSelector(state => state.childHealthStatus.loading);
  const updating = useAppSelector(state => state.childHealthStatus.updating);
  const updateSuccess = useAppSelector(state => state.childHealthStatus.updateSuccess);
  const healthStatusValues = Object.keys(HealthStatus);
  // const disabilityTypesValues = Object.keys(DisabilityTypes);
  const mentalIllnessTypesValues = Object.keys(MentalIllnessTypes);
  const sychologicalHealthTypesValues = Object.keys(SychologicalHealthTypes);
  const [disabilityUrl, setDisabilityUrl] = useState<{ id?: number; link?: string }[]>([]);
  const [mentalIllnessUrl, setMentalIllnessUrl] = useState<{ id?: number; link?: string }[]>([]);
  const [sychologicalHealthUrl, setSychologicalHealthUrl] = useState<{ id?: number; link?: string }[]>([]);
  const [disabilityKey, setDisabilityKey] = useState(10000);
  const [mentalIllnessImageKey, setmentalIllnessImageKey] = useState(100000);
  const [sychologicalHealthKey, setsychologicalHealthKey] = useState(1000000);
  const [textBoxApper, setTextBoxAppear] = useState(false);

  // statas..
  const [healthStatus, setHealthStatus] = useState(HealthStatus.GOOD);
  const [chronicDisease, setChronicDisease] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  // const [disabilityType,setDisabilityType] = useState(DisabilityTypes.COGNITIVE);
  const [hasMentalIllness, setHasMentalIllness] = useState(false);
  const [mentalIllnessType, setMentalIllnessType] = useState(MentalIllnessTypes.ANXIETY);
  const [sychologicalHealth, setSychologicalHealth] = useState(false);
  const [sychologicalHealthType, setSychologicalHealthType] = useState(SychologicalHealthTypes.CRITICAL);
  const [healthReport, setHealthReport] = useState('');
  const [notes, setNotes] = useState([]);

  // handle status...
  const handleHealthStatusChange = e => {
    setHealthStatus(e.target.value);
  };
  const handleMentalIllnessTypeChange = e => {
    setMentalIllnessType(e.target.value);
  };
  const handleSychologicalHealthTypeChange = e => {
    setSychologicalHealthType(e.target.value);
  };
  const handleHealthReport = e => {
    setHealthReport(e.target.value);
  };
  useEffect(() => {
    setNotes([]);
    if (notes.length == 0) {
      setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
    }
  }, []);

  useEffect(() => {
    if (!isNew && childHealthStatusEntity) {
      setHealthStatus(childHealthStatusEntity.healthStatus);
      setChronicDisease(childHealthStatusEntity.chronicDisease);
      setHasDisability(childHealthStatusEntity.hasDisability);
      // setDisabilityType(childHealthStatusEntity.disabilityType);
      setHasMentalIllness(childHealthStatusEntity.hasMentalIllness);
      setMentalIllnessType(childHealthStatusEntity.mentalIllnessType);
      setSychologicalHealth(childHealthStatusEntity.sychologicalHealth);
      setSychologicalHealthType(childHealthStatusEntity.sychologicalHealthType);
      setHealthReport(childHealthStatusEntity.healthReport);
    }

    if (!isNew && childHealthStatusEntity && childHealthStatusEntity.childHealthNotes?.length > 0) {
      const updatedNotes = childHealthStatusEntity.childHealthNotes.map(childNote => ({
        id: childNote?.id,
        notes: { id: childNote.notes?.id, note: childNote.notes?.note },
      }));
      setNotes(updatedNotes);
    } else if (!textBoxApper) {
      setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
      setTextBoxAppear(true);
    }
    if (disabilityKey) {
      setDisabilityKey(disabilityKey + 1);
    }
    if (mentalIllnessImageKey) {
      setmentalIllnessImageKey(mentalIllnessImageKey + 1);
    }
    if (sychologicalHealthKey) {
      setsychologicalHealthKey(sychologicalHealthKey + 1);
    }

    if (childHealthStatusEntity) {
      setDisabilityUrl([{ id: childHealthStatusEntity.disabilityImage, link: childHealthStatusEntity.disabilityImage }]);
    }
    if (childHealthStatusEntity) {
      setMentalIllnessUrl([{ id: childHealthStatusEntity.mentalIllnessImage, link: childHealthStatusEntity.mentalIllnessImage }]);
    }
    if (childHealthStatusEntity) {
      setSychologicalHealthUrl([
        { id: childHealthStatusEntity.sychologicalHealthImage, link: childHealthStatusEntity.sychologicalHealthImage },
      ]);
    }
  }, [childHealthStatusEntity]);

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

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getChildEntity(id));
    }
  }, []);

  useEffect(() => {
    if (!isNew && childEntity && childEntity.childHealthStatus) {
      dispatch(getEntity(childEntity.childHealthStatus?.id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      //handleClose();
      toast.success(translate('kafala.Child.saved'));
      dispatch(reset());
      handleNext();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values?.id !== 'number') {
      values.id = Number(values?.id);
    }

    const entity = {
      ...childHealthStatusEntity,
      healthStatus,
      chronicDisease: chronicDisease ? 1 : 0,
      hasDisability: hasDisability ? 1 : 0,
      //  disabilityType,
      hasMentalIllness: hasMentalIllness ? 1 : 0,
      mentalIllnessType,
      sychologicalHealth: sychologicalHealth ? 1 : 0,
      sychologicalHealthType,
      healthReport,
      disabilityImage: disabilityUrl && disabilityUrl.length ? disabilityUrl[0]?.link || disabilityUrl[1]?.link || null : null,
      mentalIllnessImage:
        mentalIllnessUrl && mentalIllnessUrl.length ? mentalIllnessUrl[0]?.link || mentalIllnessUrl[1]?.link || null : null,
      sychologicalHealthImage:
        sychologicalHealthUrl && sychologicalHealthUrl.length
          ? sychologicalHealthUrl[0]?.link || sychologicalHealthUrl[1]?.link || null
          : null,
      child: child,
      childHealthNotes: notes.map(childNote => ({
        id: childNote?.id,
        notes: {
          id: childNote.notes?.id,
          note: childNote.notes?.note,
        },
      })),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      entity.id = childHealthStatusEntity?.id;
      dispatch(createEntity(entity));
    }
  };
  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...childHealthStatusEntity,
          child: childHealthStatusEntity?.child?.id,
          healthStatus,
          chronicDisease,
          hasDisability,
          // disabilityType,
          hasMentalIllness,
          mentalIllnessType,
          sychologicalHealth,
          sychologicalHealthType,
          healthReport,
        };

  const removeDisabilityUrl = (fileIndex: number | void) => {
    const fileList = disabilityUrl;
    if (fileIndex) {
      fileList.splice(fileIndex - 1, 1);
    }
    setDisabilityUrl([...fileList]);
  };

  const removeMentalIllnessUrl = (fileIndex: number | void) => {
    const fileList = mentalIllnessUrl;
    if (fileIndex) {
      fileList.splice(fileIndex - 1, 1);
    }
    setMentalIllnessUrl([...fileList]);
  };

  const removeSychologicalHealthUrl = (fileIndex: number | void) => {
    const fileList = sychologicalHealthUrl;
    if (fileIndex) {
      fileList.splice(fileIndex - 1, 1);
    }
    setSychologicalHealthUrl([...fileList]);
  };

  return (
    <div className="stepContainer">
      <ValidatedForm id="healthStatusForm" defaultValues={defaultValues()} onSubmit={saveEntity}>
        {/* {!isNew ? (
          <ValidatedField
            name="id"
            required
            readOnly
            id="child-health-status-id"
            label={translate('global.field.id')}
            //validate={{ required: true }}
          />
        ) : null} */}
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.healthStatus')}
          id="child-health-status-healthStatus"
          name="healthStatus"
          data-cy="healthStatus"
          value={healthStatus}
          onChange={handleHealthStatusChange}
          type="select"
        >
          {healthStatusValues.map(healthStatus => (
            <option value={healthStatus} key={healthStatus}>
              {translate('kafalaApp.HealthStatus.' + healthStatus)}
            </option>
          ))}
        </ValidatedField>
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.chronicDisease')}
          id="child-health-status-chronicDisease"
          name="chronicDisease"
          data-cy="chronicDisease"
          value={chronicDisease}
          onChange={() => {
            setChronicDisease(!chronicDisease);
          }}
          check
          type="checkbox"
        />
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.hasDisability')}
          id="child-health-status-hasDisability"
          name="hasDisability"
          data-cy="hasDisability"
          value={hasDisability}
          onChange={() => {
            setHasDisability(!hasDisability);
          }}
          check
          type="checkbox"
        />
        {/* <ValidatedField
          label={translate('kafalaApp.childHealthStatus.disabilityType')}
          id="child-health-status-disabilityType"
          name="disabilityType"
          data-cy="disabilityType"
          value={disabilityType}
          onChange={handleDisabilityTypeChange}
          type="select"
        >
          {disabilityTypesValues.map(disabilityTypes => (
            <option value={disabilityTypes} key={disabilityTypes}>
              {translate('kafalaApp.DisabilityTypes.' + disabilityTypes)}
            </option>
          ))}
        </ValidatedField> */}
        {/* <ValidatedField
          label={translate('kafalaApp.childHealthStatus.disabilityImage')}
          id="child-health-status-disabilityImage"
          name="disabilityImage"
          data-cy="disabilityImage"
          type="text"
          validate={{ required: true }}
        /> */}

        <UploadImage
          id="disabilityImage"
          label={translate('kafalaApp.childHealthStatus.disabilityImage')}
          viewType="defaultView"
          key={disabilityKey}
          defaultImages={[
            ...(!isNew && disabilityUrl && disabilityUrl[0]?.link
              ? [
                  {
                    uid: disabilityUrl[0]?.id?.toString(),
                    url: disabilityUrl[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeDisabilityUrl}
          setImageUrl={(url: string | void) => {
            if (url) setDisabilityUrl([...disabilityUrl, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
          image/jpg,
          image/png,
          image/webp,
          image/bmp,
          image/tiff,.pdf,.xlsx,.xls,.docx,.doc"
        />

        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.hasMentalIllness')}
          id="child-health-status-hasMentalIllness"
          name="hasMentalIllness"
          data-cy="hasMentalIllness"
          value={hasMentalIllness}
          onChange={() => {
            setHasMentalIllness(!hasMentalIllness);
          }}
          check
          type="checkbox"
        />
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.mentalIllnessType')}
          id="child-health-status-mentalIllnessType"
          name="mentalIllnessType"
          data-cy="mentalIllnessType"
          value={mentalIllnessType}
          onChange={handleMentalIllnessTypeChange}
          type="select"
        >
          {mentalIllnessTypesValues.map(mentalIllnessTypes => (
            <option value={mentalIllnessTypes} key={mentalIllnessTypes}>
              {translate('kafalaApp.MentalIllnessTypes.' + mentalIllnessTypes)}
            </option>
          ))}
        </ValidatedField>
        {/* <ValidatedField
          label={translate('kafalaApp.childHealthStatus.mentalIllnessImage')}
          id="child-health-status-mentalIllnessImage"
          name="mentalIllnessImage"
          data-cy="mentalIllnessImage"
          type="text"
          validate={{ required: true }}
        /> */}

        <UploadImage
          id="mentalIllnessImage"
          label={translate('kafalaApp.childHealthStatus.mentalIllnessImage')}
          viewType="defaultView"
          key={mentalIllnessImageKey}
          defaultImages={[
            ...(!isNew && mentalIllnessUrl && mentalIllnessUrl[0]?.link
              ? [
                  {
                    uid: mentalIllnessUrl[0]?.id?.toString(),
                    url: mentalIllnessUrl[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeMentalIllnessUrl}
          setImageUrl={(url: string | void) => {
            if (url) setMentalIllnessUrl([...mentalIllnessUrl, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
          image/jpg,
          image/png,
          image/webp,
          image/bmp,
          image/tiff,.pdf,.xlsx,.xls,.docx,.doc"
        />
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.sychologicalHealth')}
          id="child-health-status-sychologicalHealth"
          name="sychologicalHealth"
          data-cy="sychologicalHealth"
          value={sychologicalHealth}
          onChange={() => {
            setSychologicalHealth(!sychologicalHealth);
          }}
          check
          type="checkbox"
        />
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.sychologicalHealthType')}
          id="child-health-status-sychologicalHealthType"
          name="sychologicalHealthType"
          data-cy="sychologicalHealthType"
          value={sychologicalHealthType}
          onChange={handleSychologicalHealthTypeChange}
          type="select"
        >
          {sychologicalHealthTypesValues.map(sychologicalHealthTypes => (
            <option value={sychologicalHealthTypes} key={sychologicalHealthTypes}>
              {translate('kafalaApp.SychologicalHealthTypes.' + sychologicalHealthTypes)}
            </option>
          ))}
        </ValidatedField>
        {/* <ValidatedField
          label={translate('kafalaApp.childHealthStatus.sychologicalHealthImage')}
          id="child-health-status-sychologicalHealthImage"
          name="sychologicalHealthImage"
          data-cy="sychologicalHealthImage"
          type="text"
          validate={{ required: true }}
        /> */}

        <UploadImage
          id="sychologicalHealthImage"
          label={translate('kafalaApp.childHealthStatus.sychologicalHealthImage')}
          viewType="defaultView"
          key={sychologicalHealthKey}
          defaultImages={[
            ...(!isNew && sychologicalHealthUrl && sychologicalHealthUrl[0]?.link
              ? [
                  {
                    uid: sychologicalHealthUrl[0]?.id?.toString(),
                    url: sychologicalHealthUrl[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeSychologicalHealthUrl}
          setImageUrl={(url: string | void) => {
            if (url) setSychologicalHealthUrl([...sychologicalHealthUrl, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
          image/jpg,
          image/png,
          image/webp,
          image/bmp,
          image/tiff,.pdf,.xlsx,.xls,.docx,.doc"
        />
        <ValidatedField
          label={translate('kafalaApp.childHealthStatus.healthReport')}
          id="child-health-status-healthReport"
          name="healthReport"
          data-cy="healthReport"
          value={healthReport}
          onChange={handleHealthReport}
          type="text"
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

export default StepTwo;

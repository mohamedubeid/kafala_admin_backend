import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText, FormGroup, Input, Label } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IChild } from 'app/shared/model/child.model';
import { getEntities as getChildren } from 'app/entities/child/child.reducer';
import { getEntity as getChildEntity } from '../../child-extend/child.reducer';
import { IChildMaritalStatus } from 'app/shared/model/child-marital-status.model';
import { OrphanClassification } from 'app/shared/model/enumerations/orphan-classification.model';
import { getEntity, updateEntity, createEntity, reset } from '../../child-marital-status-extend/child-marital-status.reducer';
import { toast } from 'react-toastify';
import UploadImage from 'app/shared/upload/upload-file';

type ChildMirtalProps = {
  child: IChild;
  handleNext: () => void;
};
const StepThree = ({ child, handleNext }: ChildMirtalProps) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childEntity = useAppSelector(state => state.child.entity);
  const childMaritalStatusEntity = useAppSelector(state => state.childMaritalStatus.entity);
  const loading = useAppSelector(state => state.childMaritalStatus.loading);
  const updating = useAppSelector(state => state.childMaritalStatus.updating);
  const updateSuccess = useAppSelector(state => state.childMaritalStatus.updateSuccess);
  const orphanClassificationValues = Object.keys(OrphanClassification);
  const [dateOfBeathImageUrl, setDateOfBeathImageUrl] = useState<{ id?: number; link?: string }[]>([]);
  const [dateOfBeathImageKey, setdateOfBeathImageKey] = useState(10000000);
  const [guardianDocumentKey, setGuardianDocumentKey] = useState(100000000);
  const [textBoxApper, setTextBoxAppear] = useState(false);

  //stats
  const [fatherDateOfDeath, setFatherDateOfDeath] = useState();
  const [numOfSibiling, setNumOfSibiling] = useState(0);
  const [orphanClassification, setOrphanClassification] = useState(OrphanClassification.FATHER_ORPHAN);
  const [guardianName, setGuardianName] = useState();
  const [guardianNationalID, setGuardianNationalID] = useState();
  const [guardianRelationship, setGuardianRelationship] = useState();
  const [guardianDocument, setGuardianDocument] = useState<{ id?: number; link?: string }[]>([]);

  //handle changes..
  const handleFatherDateOfDeathChange = e => {
    setFatherDateOfDeath(e.target.value);
  };

  const handlenumOfSibilingChange = e => {
    setNumOfSibiling(e.target.value);
  };

  const handleOrphanClassificationChange = e => {
    setOrphanClassification(e.target.value);
  };
  const handleguardianNameChange = e => {
    setGuardianName(e.target.value);
  };
  const handleGuardianNationalIDChange = e => {
    setGuardianNationalID(e.target.value);
  };

  const handleGuardianRelationshipChange = e => {
    setGuardianRelationship(e.target.value);
  };

  useEffect(() => {
    if (!isNew && childMaritalStatusEntity) {
      setFatherDateOfDeath(childMaritalStatusEntity.fatherDateOfDeath);
      setOrphanClassification(
        childMaritalStatusEntity.orphanClassification == 'OTHER'
          ? OrphanClassification.MOTHER_AND_FATHER
          : childMaritalStatusEntity.orphanClassification,
      );
      setNumOfSibiling(childMaritalStatusEntity.numOfSibiling);
      setGuardianName(childMaritalStatusEntity.guardianName);
      setGuardianNationalID(childMaritalStatusEntity.guardianNationalID);
      setGuardianRelationship(childMaritalStatusEntity.guardianRelationship);
      setGuardianDocument(childMaritalStatusEntity.guardianDocument);
    }
    if (dateOfBeathImageKey) {
      setdateOfBeathImageKey(dateOfBeathImageKey + 1);
    }
    if (guardianDocumentKey) {
      setGuardianDocumentKey(guardianDocumentKey + 1);
    }

    if (childMaritalStatusEntity) {
      setDateOfBeathImageUrl([{ id: childMaritalStatusEntity.dateOfBeathImage, link: childMaritalStatusEntity.dateOfBeathImage }]);
      setGuardianDocument([{ id: childMaritalStatusEntity.guardianDocument, link: childMaritalStatusEntity.guardianDocument }]);
    }
  }, [childMaritalStatusEntity]);

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getChildEntity(id));
    }
    if (!isNew && childEntity && childEntity.childMaritalStatus) {
      dispatch(getEntity(childEntity.childMaritalStatus?.id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(translate('kafala.Child.saved'));
      dispatch(reset());
      handleNext();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values?.id !== undefined && typeof values?.id !== 'number') {
      values.id = Number(values?.id);
    }
    if (values.numOfSibiling !== undefined && typeof values.numOfSibiling !== 'number') {
      values.numOfSibiling = Number(values.numOfSibiling);
    }
    const entity = {
      ...childMaritalStatusEntity,
      orphanClassification,
      numOfSibiling,
      fatherDateOfDeath,
      dateOfBeathImage:
        dateOfBeathImageUrl && dateOfBeathImageUrl?.length ? dateOfBeathImageUrl[0]?.link || dateOfBeathImageUrl[1]?.link || null : null,
      guardianName,
      guardianNationalID,
      guardianRelationship,
      guardianDocument:
        guardianDocument && guardianDocument?.length ? guardianDocument[0]?.link || guardianDocument[1]?.link || null : null,
      child: child,
      childMaritalNotes: [],
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      entity.id = childMaritalStatusEntity?.id;
      dispatch(createEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...childMaritalStatusEntity,
          orphanClassification,
          numOfSibiling,
          fatherDateOfDeath,
          child: childMaritalStatusEntity?.child?.id,
          guardianName,
          guardianNationalID,
          guardianRelationship,
          guardianDocument,
        };

  const removeDateOfBeathImageUrl = (fileIndex: number | void) => {
    const fileList = dateOfBeathImageUrl;
    if (fileIndex) {
      fileList.splice(fileIndex - 1, 1);
    }
    setDateOfBeathImageUrl([...fileList]);
  };
  const removeguardianDocumentUrl = (fileIndex: number | void) => {
    const fileList = guardianDocument;
    if (fileIndex) {
      fileList.splice(fileIndex - 1, 1);
    }
    setGuardianDocument([...fileList]);
  };

  return (
    <div className="stepContainer">
      <ValidatedForm id="maritalStatusForm" defaultValues={defaultValues()} onSubmit={saveEntity}>
        {/* {!isNew ? (
          <ValidatedField
            name="id"
            required
            readOnly
            id="child-marital-status-id"
            label={translate('global.field.id')}
            validate={{ required: true }}
          />
        ) : null} */}
        <ValidatedField
          label={translate('kafalaApp.childMaritalStatus.orphanClassification')}
          id="child-marital-status-orphanClassification"
          name="orphanClassification"
          data-cy="orphanClassification"
          value={orphanClassification}
          onChange={handleOrphanClassificationChange}
          type="select"
        >
          {orphanClassificationValues.map(orphanClassification => (
            <option value={orphanClassification} key={orphanClassification}>
              {translate('kafalaApp.child.' + orphanClassification)}
            </option>
          ))}
        </ValidatedField>
        <ValidatedField
          label={`${translate('kafalaApp.childMaritalStatus.fatherDateOfDeath')} *`}
          id="child-marital-status-fatherDateOfDeath"
          name="fatherDateOfDeath"
          data-cy="fatherDateOfDeath"
          type="date"
          value={fatherDateOfDeath}
          onChange={handleFatherDateOfDeathChange}
          validate={{ required: true }}
        />
        {/* <ValidatedField
                label={translate('kafalaApp.childMaritalStatus.dateOfBeathImage')}
                id="child-marital-status-dateOfBeathImage"
                name="dateOfBeathImage"
                data-cy="dateOfBeathImage"
                type="text"
              /> */}
        <UploadImage
          id="dateOfBeathImage"
          label={translate('kafalaApp.childMaritalStatus.dateOfBeathImage')}
          viewType="defaultView"
          key={dateOfBeathImageKey}
          defaultImages={[
            ...(!isNew && dateOfBeathImageUrl && dateOfBeathImageUrl[0]?.link
              ? [
                  {
                    uid: dateOfBeathImageUrl[0]?.id?.toString(),
                    url: dateOfBeathImageUrl[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeDateOfBeathImageUrl}
          setImageUrl={(url: string | void) => {
            if (url) setDateOfBeathImageUrl([...dateOfBeathImageUrl, { link: url }]);
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
          label={translate('kafalaApp.childMaritalStatus.guardianName')}
          id="child-marital-status-guardianName"
          name="guardianName"
          data-cy="guardianName"
          type="text"
          value={guardianName}
          onChange={handleguardianNameChange}
        />
        <ValidatedField
          label={translate('kafalaApp.childMaritalStatus.guardianNationalID')}
          id="child-marital-status-guardianNationalID"
          name="guardianNationalID"
          data-cy="guardianNationalID"
          type="text"
          value={guardianNationalID}
          onChange={handleGuardianNationalIDChange}
        />
        <ValidatedField
          label={translate('kafalaApp.childMaritalStatus.guardianRelationship')}
          id="child-marital-status-guardianRelationship"
          name="guardianRelationship"
          data-cy="guardianRelationship"
          type="text"
          value={guardianRelationship}
          onChange={handleGuardianRelationshipChange}
        />
        {/* <ValidatedField
                label={translate('kafalaApp.childMaritalStatus.guardianDocument')}
                id="child-marital-status-guardianDocument"
                name="guardianDocument"
                data-cy="guardianDocument"
                type="text"
                value={guardianDocument}
                onChange={handleguardianDocumentChange}
              /> */}
        <UploadImage
          id="guardianDocument"
          label={translate('kafalaApp.childMaritalStatus.guardianDocument')}
          viewType="defaultView"
          key={guardianDocumentKey}
          defaultImages={[
            ...(!isNew && guardianDocument && guardianDocument[0]?.link
              ? [
                  {
                    uid: guardianDocument[0]?.id?.toString(),
                    url: guardianDocument[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeguardianDocumentUrl}
          setImageUrl={(url: string | void) => {
            if (url) setGuardianDocument([...guardianDocument, { link: url }]);
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
          label={translate('kafalaApp.childMaritalStatus.numOfSibiling')}
          id="child-marital-status-numOfSibiling"
          name="numOfSibiling"
          data-cy="numOfSibiling"
          value={numOfSibiling}
          onChange={handlenumOfSibilingChange}
          type="text"
        />
        <Row className="mt-1">
          <Row className="mt-1">
            <Col xs="12"></Col>
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

export default StepThree;

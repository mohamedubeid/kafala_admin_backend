import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText, FormGroup, Label, Input } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IChild } from 'app/shared/model/child.model';
import { getEntities as getChildren } from 'app/entities/child/child.reducer';
import { getEntity as getChildEntity } from '../../child-extend/child.reducer';

import { IChildEducationStatus } from 'app/shared/model/child-education-status.model';
import { LastLevelOfEducation } from 'app/shared/model/enumerations/last-level-of-education.model';
import { getEntity, updateEntity, createEntity, reset } from '../../child-education-status-extend/child-education-status.reducer';
import { toast } from 'react-toastify';
import UploadImage from 'app/shared/upload/upload-file';
type ChildEducationProps = {
  child: IChild;
  handleNext: () => void;
};
const StepFour = ({ child, handleNext }: ChildEducationProps) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childEducationStatusEntity = useAppSelector(state => state.childEducationStatus.entity);
  const loading = useAppSelector(state => state.childEducationStatus.loading);
  const updating = useAppSelector(state => state.childEducationStatus.updating);
  const updateSuccess = useAppSelector(state => state.childEducationStatus.updateSuccess);
  const lastLevelOfEducationValues = Object.keys(LastLevelOfEducation);
  const [lastLevelOfEducationImageUrl, setLastLevelOfEducationImageUrl] = useState<{ id?: number; link?: string }[]>([]);
  const childEntity = useAppSelector(state => state.child.entity);
  const [lastLevelOfEducationImageKey,setlastLevelOfEducationImageKey] = useState(10000000);
  const [notes, setNotes] = useState([]);
  const [textBoxApper,setTextBoxAppear] = useState(false);


  //statas..
  const [hoppy,setHoppy]=useState();
  const [lastLevelOfEducation,setLastLevelOfEducation]=useState(LastLevelOfEducation.PRIMARY);

  // handle statwChanges...
  const handleLastLevelOfEducationChange=(e)=>{
    setLastLevelOfEducation(e.target.value);
  };

  const handleHoppyChange = (e)=>{
    setHoppy(e.target.value);
  }

  useEffect(()=>{
    setNotes([]);
    if(notes.length==0){
      setNotes([...notes, { id: null, notes: {id:null,note:''} }]);
    }
  },[]);

   //notes handle...
   useEffect(() => {
     if (!isNew && childEducationStatusEntity && childEducationStatusEntity.childEducationNotes?.length>0) {
       const updatedNotes = childEducationStatusEntity.childEducationNotes.map(childNote => (
        { id: childNote?.id, notes: {id: childNote.notes?.id,note:childNote.notes?.note} }));
        setNotes(updatedNotes);
     }else if(!textBoxApper){
      setNotes([...notes, { id: null, notes: {id:null,note:''} }]);
      setTextBoxAppear(true);
    }
    if(!isNew && childEducationStatusEntity){
      setHoppy(childEducationStatusEntity.hoppy);
      setLastLevelOfEducation(childEducationStatusEntity.lastLevelOfEducation);
    }
   }, [childEducationStatusEntity]);

   const handleAddNote = () => {
    setNotes([...notes, { id: null, notes: {id:null,note:''} }]);
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
    }else{
      dispatch(getChildEntity(id));
    }
  }, []);
  useEffect(()=>{
    if(!isNew && childEntity && childEntity.childEducationStatus){
      dispatch(getEntity(childEntity.childEducationStatus?.id));
    }
  },[]);

  useEffect(()=>{
    if(lastLevelOfEducationImageKey){
      setlastLevelOfEducationImageKey(lastLevelOfEducationImageKey+1);
     }

     if(childEducationStatusEntity){
      setLastLevelOfEducationImageUrl([{id:childEducationStatusEntity.lastLevelOfEducationImage,link:childEducationStatusEntity.lastLevelOfEducationImage}]);
     }

  },[childEducationStatusEntity])

  useEffect(() => {
    if (updateSuccess) {
      toast.success(translate('kafala.Child.saved'));
      dispatch(reset());
      handleNext();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values?.id);
    }
    const entity = {
      ...childEducationStatusEntity,
      hoppy,
      lastLevelOfEducation,
      lastLevelOfEducationImage:
        lastLevelOfEducationImageUrl && lastLevelOfEducationImageUrl?.length ? (lastLevelOfEducationImageUrl[0]?.link || lastLevelOfEducationImageUrl[1]?.link || null) : null,
      child: child,
      childEducationNotes: notes.map(childNote => ({
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
      entity.id=childEducationStatusEntity?.id;
      dispatch(createEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...childEducationStatusEntity,
          hoppy,
          lastLevelOfEducation,
          child: childEducationStatusEntity?.child?.id,
        };

  const removeLastLevelOfEducationImageUrl = (fileIndex: number | void) => {
    const fileList = lastLevelOfEducationImageUrl;
    if (fileIndex) {
      fileList.splice(fileIndex - 1, 1);
    }
    setLastLevelOfEducationImageUrl([...fileList]);
  };

  return (
    <div className="stepContainer">
      <ValidatedForm id="educationalForm" defaultValues={defaultValues()} onSubmit={saveEntity}>
        {/* {!isNew ? (
          <ValidatedField
            name="id"
            required
            readOnly
            id="child-education-status-id"
            label={translate('global.field.id')}
            validate={{ required: true }}
          />
        ) : null} */}
        <ValidatedField
          label={translate('kafalaApp.childEducationStatus.lastLevelOfEducation')}
          id="child-education-status-lastLevelOfEducation"
          name="lastLevelOfEducation"
          data-cy="lastLevelOfEducation"
          value={lastLevelOfEducation}
          onChange={handleLastLevelOfEducationChange}
          type="select"
        >
          {lastLevelOfEducationValues.map(lastLevelOfEducation => (
            <option value={lastLevelOfEducation} key={lastLevelOfEducation}>
              {translate('kafalaApp.LastLevelOfEducation.' + lastLevelOfEducation)}
            </option>
          ))}
        </ValidatedField>
        <ValidatedField
          label={translate('kafalaApp.childEducationStatus.hoppy')}
          id="child-education-status-hoppy"
          name="hoppy"
          data-cy="hoppy"
          value={hoppy}
          onChange={handleHoppyChange}
          type="text"
        />
        {/* <ValidatedField
          label={translate('kafalaApp.childEducationStatus.lastLevelOfEducationImage')}
          id="child-education-status-lastLevelOfEducationImage"
          name="lastLevelOfEducationImage"
          data-cy="lastLevelOfEducationImage"
          type="text"
        /> */}

        <UploadImage
          id="lastLevelOfEducationImage"
          label={translate('kafalaApp.childEducationStatus.lastLevelOfEducationImage')}
          viewType="defaultView"
          key={lastLevelOfEducationImageKey}
          defaultImages={
            [
              ...(!isNew && lastLevelOfEducationImageUrl && lastLevelOfEducationImageUrl[0]?.link? [{
                uid: lastLevelOfEducationImageUrl[0]?.id?.toString(),
                url: lastLevelOfEducationImageUrl[0]?.link?.toString(),
                name:  '',
              }] : []),
             ]
          }

          maxLength={1}
          removeImage={removeLastLevelOfEducationImageUrl}
          setImageUrl={(url: string | void) => {
            if (url) setLastLevelOfEducationImageUrl([...lastLevelOfEducationImageUrl, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
          image/jpg,
          image/png,
          image/webp,
          image/bmp,
          image/tiff,.pdf,.xlsx,.xls,.docx,.doc"
        />

        <Row className="mt-1">
          <Row className="mt-1">
          <Col xs="12">
      <FormGroup>
        <Label>{translate('kafalaApp.child.childNotes')}</Label>
        {
          notes.map((note, index) => (
            <Input
              type="textarea"
              key={index}
              value={note.notes.note}
              onChange={e => handleNoteChange(index, e)}
              className="mb-2"
            />
          ))
        }
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
        {/* <ValidatedField
                id="child-education-status-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childEducationStatus.child')}
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
              </ValidatedField> */}
      </ValidatedForm>
    </div>
  );
};

export default StepFour;

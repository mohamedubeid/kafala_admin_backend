import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SponserConnection } from 'app/shared/model/enumerations/sponser-connection.model';
import { SponsershipDuration } from 'app/shared/model/enumerations/sponsership-duration.model';
import { SponsershipParty } from 'app/shared/model/enumerations/sponsership-party.model';
import { ValidatedForm, ValidatedField, translate } from 'react-jhipster';
import { useNavigate, useParams } from 'react-router';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import { reset as resetChild, updateScore } from '../child.reducer';
import { IChild } from 'app/shared/model/child.model';
import { toast } from 'react-toastify';
import { Diseases } from '../../../../constants/childs';
import { getEntity, createEntity, reset } from '../../child-marital-status-extend/child-marital-status.reducer';
import { getEntity as getChildEntity } from '../../child-extend/child.reducer';

type ChildEducationProps = {
  child: IChild,
  handleNext: () => void;
};

const StepSix = ({ child, handleNext }: ChildEducationProps) => {
  console.log("child",child);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const updateScoreSuccess = useAppSelector(state => state.child.updateScoreSuccess);
  const childMaritalStatusEntity = useAppSelector(state => state.childMaritalStatus.entity);
  const [lostHousing,setLostHousing] = useState(false);
  const [lostLimbs,setLostLimbs] = useState(false);
  const [lostSight,setLostSight] = useState(false);
  const [Lostabilitytohearorspeak,setLostabilitytohearorspeak] = useState(false);
  const [chronicDiseases,setChronicDiseases]= useState(false);
  const [childIdFromProps,setChildIdFromProps] = useState(child.id);
  const [isDataChanged,setIsDataChanged]=useState(false);
  const [notes, setNotes] = useState([]);
  const [textBoxApper,setTextBoxAppear] = useState(false);
  const childEntity = useAppSelector(state => state.child.entity);

 useEffect(()=>{
  if(child){
    setChildIdFromProps(child.id);
  }
  setNotes([]);
  if(notes.length==0){
    setNotes([...notes, { id: null, notes: {id:null,note:''} }]);

  }
  if (isNew) {
    dispatch(reset());
  }else{
    dispatch(getChildEntity(id));
  }
  if(!isNew && childEntity && childEntity.childMaritalStatus){
    dispatch(getEntity(childEntity.childMaritalStatus?.id));
  }
 },[])

 useEffect(() => {
 if (!isNew && childMaritalStatusEntity && childMaritalStatusEntity.childMaritalNotes?.length>0) {
   const updatedNotes = childMaritalStatusEntity.childMaritalNotes.map(childNote => (
     { id: childNote?.id, notes: {id: childNote.notes?.id,note:childNote.notes?.note} }));
     setNotes(updatedNotes);
   }else if(!textBoxApper){
     setNotes([...notes, { id: null, notes: {id:null,note:''} }]);
     setTextBoxAppear(true);
   }
   if(!isNew && childMaritalStatusEntity){
    setLostHousing(childMaritalStatusEntity.lostHousing);
    setLostLimbs(childMaritalStatusEntity.lostLimbs);
    setLostSight(childMaritalStatusEntity.lostSight);
    setLostabilitytohearorspeak(childMaritalStatusEntity.losthearorspeak);
    setChronicDiseases(childMaritalStatusEntity.hasChronicDiseases);
   }
}, [childMaritalStatusEntity]);


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
  const handleLostHousingChange = ()=>{
        setLostHousing(!lostHousing);
  }
  const handleLostLimbsChange =()=>{
      setLostLimbs(!lostLimbs);
  }
  const handleLostSightChange =()=>{
      setLostSight(!lostSight);
  }

  const handleLostabilitytohearorspeakChange =()=>{
      setLostabilitytohearorspeak(!Lostabilitytohearorspeak);
  }

  const handleChronicDiseases = ()=>{
      setChronicDiseases(!chronicDiseases);
  }

  useEffect(() => {
    if (updateScoreSuccess ) {
      toast.success(translate('kafala.Child.saved'));
      dispatch(reset());
      dispatch(resetChild());
      handleNext();
    }
  }, [updateScoreSuccess]);

  const saveEntity = () => {
    const entity = {
      ...childMaritalStatusEntity,
         child: child,
         lostHousing:lostHousing?true:false,
         lostLimbs:lostLimbs?true:false,
         lostSight:lostSight?true:false,
         losthearorspeak:Lostabilitytohearorspeak?true:false,
         hasChronicDiseases:chronicDiseases?true:false,
      childMaritalNotes: notes.map(childNote => ({
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
      entity.id=childMaritalStatusEntity?.id;
      dispatch(createEntity(entity));
    }
    let score=0;
    if(lostHousing){
      score+=Diseases.lostHousing;
    }
    if(lostLimbs){
      score+=Diseases.lostLimbs;
    }
    if(lostSight){
      score+=Diseases.lostSight;
    }

    if(Lostabilitytohearorspeak){
      score+=Diseases.Lostabilitytohearorspeak;
    }
    if(chronicDiseases){
      score+=Diseases.chronicDiseases;
    }

      const scoreData = {
        childId: childIdFromProps,
        score: score,
      };

      dispatch(updateScore(scoreData));



  };


  return (
    <div className="stepContainer">
    <ValidatedForm id="HarmsForm"  onSubmit={saveEntity}>
      <ValidatedField
        label={translate('kafalaApp.childMaritalStatus.lostHousing')}
        id="child-health-status-sychologicalHealth"
        name="lostHousing"
        data-cy="lostHousing"
        className='mt-2'
        checked={lostHousing}
        onChange={handleLostHousingChange}
        check
        type="checkbox"

      />
        <ValidatedField
        label={translate('kafalaApp.childMaritalStatus.lostLimbs')}
        id="child-health-status-lostLimbs"
        name="lostLimbs"
        data-cy="lostLimbs"
        className='mt-2'
        checked={lostLimbs}
        onChange={handleLostLimbsChange}
        check
        type="checkbox"

      />
 <ValidatedField
        label={translate('kafalaApp.childMaritalStatus.lostSight')}
        id="child-health-status-lostLimbs"
        name="lostSight"
        data-cy="lostSight"
        className='mt-2'
        checked={lostSight}
        onChange={handleLostSightChange}
        check
        type="checkbox"

      />
 <ValidatedField
        label={translate('kafalaApp.childMaritalStatus.Lostabilitytohearorspeak')}
        id="child-health-status-Lostabilitytohearorspeak"
        name="Lostabilitytohearorspeak"
        data-cy="Lostabilitytohearorspeak"
        checked={Lostabilitytohearorspeak}
        onChange={handleLostabilitytohearorspeakChange}
        check
         className='mt-2'
        type="checkbox"

      />
 <ValidatedField
        label={translate('kafalaApp.childMaritalStatus.chronicDiseases')}
        id="child-health-status-chronicDiseases"
        name="chronicDiseases"
        data-cy="chronicDiseases"
         className='mt-2'
         checked={chronicDiseases}
        onChange={handleChronicDiseases}
        check
        type="checkbox"

      />
     <FormGroup>
        <Label className='mt-5' >{translate('kafalaApp.childMaritalStatus.childHarms')}</Label>
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
        {translate('kafalaApp.childMaritalStatus.newHarm')}
      </Button>

    </ValidatedForm>
  </div>
  );
};

export default StepSix;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, updateEntity, createEntity, reset } from '../child.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { Gender } from 'app/shared/model/enumerations/gender.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UploadImage from 'app/shared/upload/upload-file';
import { IChild } from 'app/shared/model/child.model';

type ChildProps = {
  child?: IChild;
  handleNext: () => void;
};
const StepOne = ({ child, handleNext }: ChildProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;
  const childEntity = useAppSelector(state => state.child.entity);
  const updateSuccess = useAppSelector(state => state.child.updateSuccess);
  const genderValues = Object.keys(Gender);
  const [imgUrl, setImgUrl] = useState<{ id?: number; link?: string }[]>([]);
  const [nationalImage, setNationalImage] = useState<{ id?: number; link?: string }[]>([]);
  const [birthDateImage, setBirthDateImage] = useState<{ id?: number; link?: string }[]>([]);
  const [childImage, setChildImage] = useState<{ id?: number; link?: string }[]>([]);
  const [videoUrl, setVideoUrl] = useState<{ id?: number; link?: string }[]>([]);
  const [InitialNationalImageRemoved, setInitialNationlImageRemoved] = useState(false);
  const [InitialBirthDateImageRemoved, setInitialBirthDateImageRemoved] = useState(false);
  const [isInitialVedioRemoved, setIsInitialVedioRemoved] = useState(false);
  const [initialChidImageRemoved, setInitialChildImageRemoved] = useState(false);
  const [nationalKey, setNationalKey] = useState(1);
  const [BirthDateImageKey, setBirthDateImageKey] = useState(10);
  const [childImageKey, setChildImageKey] = useState(100);
  const [vedioKey, setVedioKey] = useState(1000);
  const [notes, setNotes] = useState([]);

  // statas for inputs..
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setgender] = useState(Gender.FEMALE);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [textBoxApper, setTextBoxAppear] = useState(false);
  useEffect(() => {
    setNotes([]);
    if (notes.length == 0) {
      setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
    }
  }, []);

  useEffect(() => {
    if (!isNew && childEntity && childEntity.childNotes?.length > 0) {
      const updatedNotes = childEntity.childNotes.map(childNote => ({
        id: childNote.id,
        notes: { id: childNote.notes.id, note: childNote.notes.note },
      }));
      setNotes(updatedNotes);
    } else if (!textBoxApper) {
      setNotes([...notes, { id: null, notes: { id: null, note: '' } }]);
      setTextBoxAppear(true);
    }

    //**** */
    if (childEntity) {
      setNationalImage([{ id: childEntity.nationalImage, link: childEntity.nationalImage }]);
      setBirthDateImage([{ id: childEntity.birthCertificate, link: childEntity.birthCertificate }]);
      setChildImage([{ id: childEntity.imageUrl, link: childEntity.imageUrl }]);
      setVideoUrl([{ id: childEntity.vedio, link: childEntity.vedio }]);
      //set initial values..
      if (!isNew && childEntity) {
        setEmail(childEntity.email);
        setName(childEntity.firstName);
        setNationalId(childEntity.nationalId);
        setFatherName(childEntity.fatherName);
        setMotherName(childEntity.motherName);
        setFamilyName(childEntity.familyName);
        setgender(childEntity.gender);
        setAge(childEntity.age);
        setDescription(childEntity.description);
        setAddress(childEntity.address);
      }
    }
    /** */
    if (nationalImage) {
      setNationalKey(nationalKey + 1);
    }
    if (birthDateImage) {
      setBirthDateImageKey(BirthDateImageKey + 1);
    }
    if (childImage) {
      setChildImageKey(childImageKey + 1);
    }
    if (videoUrl) {
      setVedioKey(vedioKey + 1);
    }
  }, [childEntity]);

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
    dispatch(getUsers({}));
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (updateSuccess) {
      handleNext();
    }
  }, [updateSuccess]);

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

  //handle input changes..
  const handleEmailChange = e => {
    setEmail(e.target.value);
  };
  const handleNameChange = e => {
    setName(e.target.value);
  };
  const handleNationalIdChange = e => {
    setNationalId(e.target.value);
  };
  const handleFatheNameChange = e => {
    setFatherName(e.target.value);
  };
  const handleMotherNameChange = e => {
    setMotherName(e.target.value);
  };
  const handleFamilyNameChange = e => {
    setFamilyName(e.target.value);
  };
  const handleGenderChange = e => {
    setgender(e.target.value);
  };
  const handleAgeChange = e => {
    setAge(e.target.value);
  };
  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };
  const handleAddressChange = e => {
    setAddress(e.target.value);
  };

  const removeChildImageUrl = (imageIndex: number | void) => {
    const childImage = imgUrl;
    if (imageIndex) {
      childImage.splice(imageIndex - 1, 1);
    }
    setChildImage([...childImage]);
    setInitialChildImageRemoved(true);
  };

  const removeNationalImageUrl = (imageIndex: number | void) => {
    const nationalImageList = imgUrl;
    if (imageIndex) {
      nationalImageList.splice(imageIndex - 1, 1);
    }
    setNationalImage([...nationalImageList]);
    setInitialNationlImageRemoved(true);
  };

  const removeBirthDateImageImageUrl = (imageIndex: number | void) => {
    const imgList = imgUrl;
    if (imageIndex) {
      imgList.splice(imageIndex - 1, 1);
    }
    setBirthDateImage([...imgList]);
    setInitialBirthDateImageRemoved(true);
  };

  const removeVideoUrl = (videoIndex: number | void) => {
    const VideoList = videoUrl;
    if (videoIndex) {
      VideoList.splice(videoIndex - 1, 1);
    }
    setVideoUrl([...VideoList]);
    setIsInitialVedioRemoved(true);
  };
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.age !== undefined && typeof values.age !== 'number') {
      values.age = Number(values.age);
    }

    const entity = {
      ...childEntity,
      email,
      firstName: name,
      nationalId,
      fatherName,
      motherName,
      familyName,
      gender,
      age,
      description,
      address,
      imageUrl: childImage && childImage.length ? childImage[0]?.link || childImage[1]?.link || null : null,
      nationalImage: nationalImage && nationalImage?.length ? nationalImage[0]?.link || nationalImage[1]?.link || null : null,
      birthCertificate: birthDateImage && birthDateImage?.length ? birthDateImage[0]?.link || birthDateImage[1]?.link || null : null,
      vedio: videoUrl && videoUrl?.length ? videoUrl[0]?.link || videoUrl[1]?.link || null : null,
      childNotes: notes.map(childNote => ({
        id: childNote.id,
        notes: {
          id: childNote.notes.id,
          note: childNote.notes.note,
        },
      })),
      ...(isNew && { status: 'APPROVED' }),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      entity.id = childEntity.id;
      dispatch(createEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...childEntity,
          user: childEntity?.user?.id,
          nationalImage: childEntity.nationalImage,
          email,
          firstName: name,
          nationalId,
          fatherName,
          motherName,
          familyName,
          gender,
          age,
          description,
          address,
        };
  return (
    <div className="stepContainer">
      <ValidatedForm id="profileForm" defaultValues={defaultValues()} onSubmit={saveEntity}>
        {!isNew ? (
          <ValidatedField
            value={childEntity.id}
            name="id"
            required
            readOnly
            id="child-id"
            label={`${translate('global.field.id')} *`}
            validate={{ required: true }}
          />
        ) : null}
        <ValidatedField
          label={translate('kafalaApp.child.email')}
          id="child-email"
          name="email"
          data-cy="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          disabled={false}
          validate={{
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: translate('global.form.invalidEmail'),
            },
          }}
        />

        <ValidatedField
          label={`${translate('kafalaApp.child.firstName')} *`}
          id="child-firstName"
          name="firstName"
          data-cy="firstName"
          value={name}
          onChange={handleNameChange}
          type="text"
          validate={{ required: true }}
        />

        <ValidatedField
          label={`${translate('kafalaApp.child.nationalId')} *`}
          id="child-nationalId"
          name="nationalId"
          data-cy="nationalId"
          value={nationalId}
          onChange={handleNationalIdChange}
          type="text"
          validate={{ required: true }}
        />
        <UploadImage
          id="child-national-image"
          label={translate('kafalaApp.child.nationalImage')}
          viewType="defaultView"
          key={nationalKey}
          defaultImages={[
            ...(!isNew && nationalImage && !InitialNationalImageRemoved && nationalImage[0]?.link
              ? [
                  {
                    uid: nationalImage[0]?.id?.toString(),
                    url: nationalImage[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeNationalImageUrl}
          setImageUrl={(url: string | void) => {
            if (url) setNationalImage([...nationalImage, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
                    image/jpg,
                    image/png,
                    image/webp,
                    image/bmp"
        />
        <UploadImage
          id="child-birth-certificate"
          label={translate('kafalaApp.child.birthCertificate')}
          viewType="defaultView"
          key={BirthDateImageKey}
          defaultImages={[
            ...(!isNew && birthDateImage && !InitialBirthDateImageRemoved && birthDateImage[0]?.link
              ? [
                  {
                    uid: birthDateImage[0]?.id?.toString(),
                    url: birthDateImage[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeBirthDateImageImageUrl}
          setImageUrl={(url: string | void) => {
            if (url) setBirthDateImage([...birthDateImage, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
                    image/jpg,
                    image/png,
                    image/webp,
                    image/bmp"
        />
        <ValidatedField
          label={`${translate('kafalaApp.child.fatherName')} *`}
          id="child-fatherName"
          name="fatherName"
          data-cy="fatherName"
          value={fatherName}
          onChange={handleFatheNameChange}
          type="text"
          validate={{ required: true }}
        />
        <ValidatedField
          label={`${translate('kafalaApp.child.motherName')} *`}
          id="child-motherName"
          name="motherName"
          data-cy="motherName"
          value={motherName}
          onChange={handleMotherNameChange}
          type="text"
          validate={{ required: true }}
        />
        <ValidatedField
          label={`${translate('kafalaApp.child.familyName')} *`}
          id="child-familyName"
          name="familyName"
          value={familyName}
          data-cy="familyName"
          onChange={handleFamilyNameChange}
          type="text"
          validate={{ required: true }}
        />

        <UploadImage
          id="child-image"
          label={translate('kafalaApp.child.image')}
          viewType="defaultView"
          key={childImageKey}
          defaultImages={[
            ...(!isNew && childImage && !initialChidImageRemoved && childImage[0]?.link
              ? [
                  {
                    uid: childImage[0]?.id?.toString(),
                    url: childImage[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
          ]}
          maxLength={1}
          removeImage={removeChildImageUrl}
          setImageUrl={(url: string | void) => {
            if (url) setChildImage([...childImage, { link: url }]);
          }}
          title=""
          acceptTypes="image/jpeg,
                    image/jpg,
                    image/png,
                    image/webp,
                    image/bmp"
        />
        <ValidatedField
          validate={{ required: true }}
          label={`${translate('kafalaApp.child.gender')} *`}
          id="child-gender"
          name="gender"
          data-cy="gender"
          value={gender}
          onChange={handleGenderChange}
          type="select"
        >
          {genderValues.map(gender => (
            <option value={gender} key={gender}>
              {translate('kafalaApp.Gender.' + gender)}
            </option>
          ))}
        </ValidatedField>
        <ValidatedField
          validate={{ required: true }}
          label={`${translate('kafalaApp.child.age')} *`}
          id="child-age"
          name="age"
          value={age}
          onChange={handleAgeChange}
          data-cy="age"
          type="text"
        />

        <UploadImage
          id="child-vedio"
          label={translate('kafalaApp.child.vedio')}
          viewType="defaultView"
          key={vedioKey}
          defaultImages={[
            ...(!isNew && videoUrl && !isInitialVedioRemoved && videoUrl[0]?.link?.toString()
              ? [
                  {
                    uid: videoUrl[0]?.id?.toString(),
                    url: videoUrl[0]?.link?.toString(),
                    name: '',
                  },
                ]
              : []),
            ...(imgUrl && imgUrl.length
              ? imgUrl.map(childImage => ({
                  uid: childImage?.link || '',
                  url: childImage?.link || '',
                  name: childImage?.link || '',
                }))
              : []),
          ]}
          maxLength={1}
          removeImage={removeVideoUrl}
          setImageUrl={(url: string | void) => {
            if (url) setVideoUrl([...videoUrl, { link: url }]);
          }}
          title=""
          acceptTypes="video/mp4,
          video/webm,
          video/ogg,
          video/avi,
          video/mov"
        />
        <ValidatedField
          label={`${translate('kafalaApp.child.description')} *`}
          id="child-description"
          name="description"
          data-cy="description"
          value={description}
          onChange={handleDescriptionChange}
          type="textarea"
          validate={{ required: true }}
        />
        <ValidatedField
          label={`${translate('kafalaApp.child.address')} *`}
          id="child-address"
          name="address"
          data-cy="address"
          value={address}
          onChange={handleAddressChange}
          type="text"
          validate={{ required: true }}
        />
        {/* <ValidatedField id="child-user" name="user" data-cy="user" label={translate('kafalaApp.child.user')} type="select">
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField> */}
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

export default StepOne;

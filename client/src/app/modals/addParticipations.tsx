import React, { useEffect, useRef, useState } from 'react';
import { Translate, translate, ValidatedField } from 'react-jhipster';
import { Modal, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ParticipationTypes } from 'app/shared/model/enumerations/participation-types.model';
import UploadImage from 'app/shared/upload/upload-file';

type AddParticipationType = {
  isModalOpen: boolean;
  currentLocale?: string;
  handleCancel: () => void;
  saveEntity: (entity) => void;
};

const AddParticipation = ({
  isModalOpen,
  handleCancel,
  saveEntity,
}: AddParticipationType) => {
  const participationTypesValues = Object.keys(ParticipationTypes);

  const [participationImage, setParticipationImage] = useState<{ id?: number; link?: string }[]>([]);
  const [participationType, setParticipationType] = useState(ParticipationTypes.ACHEIVEMENT || '');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      setParticipationImage([]);
      setParticipationType(ParticipationTypes.ACHEIVEMENT);
      setDescription('');
    }
  }, [isModalOpen]);

  const removeParticipationImageUrl = (imageIndex: number | void) => {
    if (imageIndex && participationImage.length > 0) {
      const nationalImageList = [...participationImage];
      nationalImageList.splice(imageIndex - 1, 1);
      setParticipationImage(nationalImageList);
    }
  };

  const handleSaveChildParticipation = () => {
    const entity = {
      image: participationImage.length ? (participationImage[0]?.link || null) : null,
      participationType,
      desceription:description,
    };
    saveEntity(entity);
  };

  return (
    <Modal open={isModalOpen} footer={null} onCancel={handleCancel} width={600} closable={false} className="feildsDesign">
      <div id="addorEditClinicClient">
        <h1 className="font-semibold mb-3 text-black" style={{ fontSize: '24px' }}>
          <Translate contentKey="kafalaApp.child.addParticipation">Add/ Edit Participation</Translate>
        </h1>

        <ValidatedField
          label={translate('kafalaApp.childPrticipations.participationType')}
          id="child-prticipations-participationType"
          name="participationType"
          data-cy="participationType"
          type="select"
          value={participationType}
          onChange={e => setParticipationType(e.target.value)}
        >
          {participationTypesValues.map(pt => (
            <option value={pt} key={pt}>
              {translate('kafalaApp.ParticipationTypes.' + pt)}
            </option>
          ))}
        </ValidatedField>

        <UploadImage
  key={participationImage.length}
  id="child-national-image"
  label={translate('kafalaApp.childPrticipations.participationImage')}
  viewType="defaultView"
  defaultImages={
    participationImage.length && participationImage[0]?.link
      ? [
          {
            uid: participationImage[0]?.id?.toString(),
            url: participationImage[0]?.link?.toString(),
            name: '',
          },
        ]
      : []
  }
  maxLength={1}
  removeImage={removeParticipationImageUrl}
  setImageUrl={url => url && setParticipationImage([{ link: url }])}
  title=""
  acceptTypes="image/jpeg, image/jpg, image/png, image/webp, image/bmp"
/>

        <ValidatedField
          label={translate('kafalaApp.childPrticipations.desceription')}
          id="child-prticipations-desceription"
          name="desceription"
          data-cy="desceription"
          type="text"
          className="rounded-[8px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-between buttons">
        <button className="addButton" onClick={handleSaveChildParticipation}>
          <Translate contentKey="kafalaApp.childPrticipations.add">Add</Translate>
        </button>
        <button className="cancelButton" onClick={handleCancel}>
          <Translate contentKey="kafalaApp.childPrticipations.cancel">Cancel</Translate>
        </button>
      </div>
    </Modal>
  );
};

export default AddParticipation;

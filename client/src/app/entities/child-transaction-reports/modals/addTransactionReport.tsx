import React, { useEffect, useRef, useState } from 'react';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { Modal, Button } from 'antd';
import UploadImage from '../upload-file';
import { toast } from 'react-toastify';

type AddTransactionReportType = {
  isModalOpen: boolean;
  currentLocale?: string;
  handleCancel: () => void;
  saveEntity: (entity) => void;
  transactionReport?: any;
};

const AddTransactionReport = ({
  isModalOpen,
  handleCancel,
  saveEntity,
  transactionReport
}: AddTransactionReportType) => {

  const [transactionImage, setTransactionImage] = useState<{ id?: number; link?: string }[]>([]);
  const [transactionVideo, setTransactionVideo] = useState<{ id?: number; link?: string }[]>([]);
  const [amountReceived, setAmountReceived] = useState(0);
  const [description, setDescription] = useState('');

  const isNew = !transactionReport?.id;

  useEffect(() => {
    if (transactionReport && isModalOpen) {
      setTransactionImage(
        transactionReport.image
          ? [{ id: transactionReport.id, link: transactionReport.image }]
          : []
      );
      setTransactionVideo(
        transactionReport.video
          ? [{ id: transactionReport.id, link: transactionReport.video }]
          : []
      );
      setAmountReceived(transactionReport.amount_received || 0);
      setDescription(transactionReport.desceription || '');
    }
  }, [transactionReport]);

  const removeTransactionImageUrl = (imageIndex: number | void) => {
    if (imageIndex && transactionImage.length > 0) {
      const transactionImageList = [...transactionImage];
      transactionImageList.splice(imageIndex - 1, 1);
      setTransactionImage(transactionImageList);
    }
  };

  const removeTransactionVideoUrl = (imageIndex: number | void) => {
    if (imageIndex && transactionVideo.length > 0) {
      const transactionVideoList = [...transactionVideo];
      transactionVideoList.splice(imageIndex - 1, 1);
      setTransactionVideo(transactionVideoList);
    }
  };

  const handleSaveChildTransaction = () => {

    if (amountReceived <= 0) {
      toast.error(translate('kafalaApp.childTransactionReports.amountRequired'));
      return;
    }

    if (!transactionImage.length || !transactionImage[0]?.link) {
      toast.error(translate('kafalaApp.childTransactionReports.imageRequired'));
      return;
    }
    const entity = {
      ...transactionReport,
      image: transactionImage.length ? (transactionImage[0]?.link || null) : null,
      video: transactionVideo.length ? (transactionVideo[0]?.link || null) : null,
      amount_received: amountReceived,
      desceription:description,
    };
    console.log("entity: ", entity);
    saveEntity(entity);
    clearnStates();
  };

  const handleClose = () => {
    clearnStates();
    handleCancel();
  };

  const clearnStates = () => {
    setTransactionImage( []);
    setTransactionVideo([]);
    setAmountReceived(0);
    setDescription('');
  }

  return (
    <Modal open={isModalOpen} footer={null} onCancel={handleClose} width={600} closable={false} className="feildsDesign">
      <div id="addorEditClinicClient">
        <h1 className="font-semibold mb-4 text-black" style={{ fontSize: '24px' }}>
          <Translate contentKey="kafalaApp.childTransactionReports.addTransactionReport">Add Transaction Report</Translate>
        </h1>
        <ValidatedForm id="childTransactionReports"  onSubmit={handleSaveChildTransaction}>
          <ValidatedField
              label={`${translate('kafalaApp.childTransactionReports.amountReceived')} *`}
              id="child-transaction-amount-received"
              name="amount_received"
              data-cy="amount_received"
              type="number"
              validate={{ required: true }}
              value={amountReceived}
              onChange={e => setAmountReceived(Number(e.target.value))}
            />
            <UploadImage
              id="child-transaction-image"
              key="child-transaction-image-key"
              label={translate('kafalaApp.childTransactionReports.transactionImage')}
              viewType="defaultView"
              defaultImages={[
                ...(transactionImage && transactionImage[0]?.link
                  ? [
                      {
                        uid: transactionImage[0]?.id?.toString(),
                        url: transactionImage[0]?.link?.toString(),
                        name: '',
                      },
                    ]
                  : []),
              ]}
              maxLength={1}
              removeImage={removeTransactionImageUrl}
              setImageUrl={(url: string | void) => {
                if (url) setTransactionImage([...transactionImage, { link: url }]);
              }}
              title=""
              acceptTypes="image/jpeg,
                        image/jpg,
                        image/png,
                        image/webp,
                        image/bmp"
              />

            <UploadImage
              id="child-vedio"
              key="child-vedio=key"
              label={translate('kafalaApp.childTransactionReports.transactionVideo')}
              viewType="defaultView"
              defaultImages={
                transactionVideo.length && transactionVideo[0]?.link
                  ? [
                      {
                        uid: transactionVideo[0]?.id?.toString(),
                        url: transactionVideo[0]?.link?.toString(),
                        name: '',
                      },
                    ]
                  : []
              }
              maxLength={1}
              removeImage={removeTransactionVideoUrl}
              setImageUrl={(url: string | void) => {
                if (url) setTransactionVideo([...transactionVideo, { link: url }]);
              }}
              title=""
              acceptTypes="video/mp4,
              video/webm,
              video/ogg,
              video/avi,
              video/mov"
            />

            <ValidatedField
              label={translate('kafalaApp.childTransactionReports.desceription')}
              id="child-prticipations-desceription"
              name="desceription"
              data-cy="desceription"
              type="text"
              className="rounded-[8px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="d-flex justify-content-between buttons">
              <Button htmlType='submit' className="addButton">
                {translate(`kafalaApp.childTransactionReports.${isNew ? 'add' : 'edit'}`)}
              </Button>
              <Button htmlType='button' className="cancelButton" onClick={handleClose}>
                {translate('kafalaApp.childTransactionReports.cancel')}
              </Button>
            </div>
        </ValidatedForm>
      </div>
    </Modal>
  );
};

export default AddTransactionReport;

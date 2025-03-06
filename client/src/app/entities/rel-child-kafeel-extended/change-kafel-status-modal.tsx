import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Spin } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { IRelChildKafeel } from 'app/shared/model/rel-child-kafeel.model';
import { RelChildKafeelStatus } from 'app/shared/model/enumerations/rel-child-kafeel-status.model';

const { Option } = Select;

type ChangeChildKafeelStatusModalProps = {
  childKafeel: IRelChildKafeel | null;
  availableStatuses: RelChildKafeelStatus[]; // Change to enum type
  isOpen: boolean;
  onSubmit: (status: RelChildKafeelStatus) => void;
  onCancel: () => void;
  updateSuccess: boolean;
  loading: boolean;
  selectedStatus: RelChildKafeelStatus;
};

const ChangeChildKafeelStatusModal = ({
  childKafeel,
  availableStatuses,
  isOpen,
  onSubmit,
  onCancel,
  updateSuccess,
  loading,
  selectedStatus,
}: ChangeChildKafeelStatusModalProps) => {
  const [internalStatus, setInternalStatus] = useState<RelChildKafeelStatus>(selectedStatus);

  useEffect(() => {
    if (childKafeel) {
      setInternalStatus((childKafeel.status as RelChildKafeelStatus) || RelChildKafeelStatus.PENDING);
    }
  }, [childKafeel, isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      onCancel();
    }
  }, [updateSuccess, onCancel]);

  const handleStatusChange = (value: RelChildKafeelStatus) => {
    setInternalStatus(value);
  };

  const handleSave = () => {
    if (internalStatus && childKafeel) {
      onSubmit(internalStatus);
    }
  };

  return (
    <Modal
      onCancel={onCancel}
      title={
        <div>
          <Translate contentKey="kafalaApp.relChildKafeel.changeStatus">Change Status</Translate>
        </div>
      }
      centered
      open={isOpen}
      footer={null}
    >
      {childKafeel ? (
        <>
          <h5 className="mb-2">
            <Translate contentKey="kafalaApp.relChildKafeel.changeStatus">Change Status</Translate>
          </h5>
          <Select id="status" className="w-100" value={internalStatus} onChange={handleStatusChange}>
            {availableStatuses.map(status => (
              <Option key={status} value={status}>
                {translate(`kafalaApp.RelChildKafeelStatus.${status}`)}
              </Option>
            ))}
          </Select>
          <div className="d-flex justify-content-center align-items-center">
            <Button size="large" type="primary" className="btn btn-success mt-2" onClick={handleSave} disabled={loading || !internalStatus}>
              {loading ? <Spin /> : 'Save'}
            </Button>
          </div>
        </>
      ) : (
        <div className="d-flex p-4 justify-content-center align-items-center">
          <Spin />
        </div>
      )}
    </Modal>
  );
};

export default ChangeChildKafeelStatusModal;

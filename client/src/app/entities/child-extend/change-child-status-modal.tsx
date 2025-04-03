import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Spin } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { ChildStatus } from 'app/shared/model/enumerations/child-status.model'; // Enum for child statuses

const { Option } = Select;

type ChangeChildStatusModalProps = {
  child: any;
  availableStatuses: ChildStatus[];
  isOpen: boolean;
  onSubmit: (status: ChildStatus) => void;
  onCancel: () => void;
  updateSuccess: boolean;
  loading: boolean;
  selectedStatus: ChildStatus;
};

const ChangeChildStatusModal = ({
  child,
  availableStatuses,
  isOpen,
  onSubmit,
  onCancel,
  updateSuccess,
  loading,
  selectedStatus,
}: ChangeChildStatusModalProps) => {
  const [internalStatus, setInternalStatus] = useState<ChildStatus>(selectedStatus);

  useEffect(() => {
    if (child) {
      setInternalStatus((child.status as ChildStatus) || ChildStatus.PENDING);
    }
  }, [child, isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      onCancel();
    }
  }, [updateSuccess, onCancel]);

  const handleStatusChange = (value: ChildStatus) => {
    setInternalStatus(value);
  };

  const handleSave = () => {
    if (internalStatus && child) {
      onSubmit(internalStatus);
    }
  };

  return (
    <Modal
      onCancel={onCancel}
      title={
        <div>
          <Translate contentKey="kafalaApp.child.changeStatus">Change Status</Translate>
        </div>
      }
      centered
      open={isOpen}
      footer={null}
    >
      {child ? (
        <>
          <h5 className="mb-2">
            <Translate contentKey="kafalaApp.child.changeStatus">Change Child Status</Translate>
          </h5>
          <Select id="status" className="w-100" value={internalStatus} onChange={handleStatusChange}>
            {availableStatuses.map(status => (
              <Option key={status} value={status}>
                {translate(`kafalaApp.ChildStatus.${status}`)}
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

export default ChangeChildStatusModal;
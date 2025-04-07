import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Spin } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { ChildTransactionRreportsStatus } from 'app/shared/model/enumerations/child-transaction-reports-status';

const { Option } = Select;

type ChangeTransactionStatusModalProps = {
  transactionReport: any;
  availableStatuses: ChildTransactionRreportsStatus[];
  isOpen: boolean;
  onSubmit: (status: ChildTransactionRreportsStatus) => void;
  onCancel: () => void;
  updateSuccess: boolean;
  loading: boolean;
  selectedStatus: ChildTransactionRreportsStatus;
};

const ChangeTransactionStatusModal = ({
  transactionReport,
  availableStatuses,
  isOpen,
  onSubmit,
  onCancel,
  updateSuccess,
  loading,
  selectedStatus,
}: ChangeTransactionStatusModalProps) => {
  const [internalStatus, setInternalStatus] = useState<ChildTransactionRreportsStatus>(selectedStatus);

  useEffect(() => {
    if (transactionReport) {
      setInternalStatus((transactionReport.status as ChildTransactionRreportsStatus) || ChildTransactionRreportsStatus.PENDING);
    }
  }, [transactionReport, isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      onCancel();
    }
  }, [updateSuccess, onCancel]);

  const handleStatusChange = (value: ChildTransactionRreportsStatus) => {
    setInternalStatus(value);
  };

  const handleSave = () => {
    if (internalStatus && transactionReport) {
      onSubmit(internalStatus);
    }
  };

  return (
    <Modal
      onCancel={onCancel}
      title={
        <div>
          <Translate contentKey="kafalaApp.childTransactionReports.changeStatus">Change Status</Translate>
        </div>
      }
      centered
      open={isOpen}
      footer={null}
    >
      {transactionReport ? (
        <>
          <h5 className="mb-2">
            <Translate contentKey="kafalaApp.childTransactionReports.changeStatus">Change Child Status</Translate>
          </h5>
          <Select id="status" className="w-100" value={internalStatus} onChange={handleStatusChange}>
            {availableStatuses.map(status => (
              <Option key={status} value={status}>
                {translate(`kafalaApp.childTransactionReports.status.${status}`)}
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

export default ChangeTransactionStatusModal;
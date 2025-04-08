import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type DeleteTransactionReportType = {
  isModalOpen: boolean;
  handleCancel: () => void;
  deleteEntity: (entity) => void;
  transactionReport?: any;
};


export const ChildTransactionsDeleteDialog = ({
  isModalOpen,
  handleCancel,
  deleteEntity,
  transactionReport
}: DeleteTransactionReportType) => {

  return (
    <Modal isOpen={isModalOpen} toggle={handleCancel}>
      <ModalHeader toggle={handleCancel} data-cy="ChildTransactionsDeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="kafalaApp.childTransactionReports.delete.question">
        <Translate contentKey="kafalaApp.childTransactionReports.delete.question" interpolate={{ id: transactionReport?.id }}>
          Are you sure you want to delete this Child Transaction?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleCancel}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="jhi-confirm-delete-childTransactions" data-cy="entityConfirmDeleteButton" color="danger" onClick={deleteEntity}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChildTransactionsDeleteDialog;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSortState, JhiItemCount, JhiPagination, Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import AddTransactionReport from 'app/entities/child-transaction-reports/modals/addTransactionReport';
import { getEntity } from '../child-extend/child.reducer';
import { Row, Table } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams, overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getChildTransactions, createEntity, ChildTransactionReportsSlice, deleteEntity } from './child-transaction-reports.reducer';
import { ChildTransactionRreportsStatus } from 'app/shared/model/enumerations/child-transaction-reports-status';
import ChangeTransactionStatusModal from './modals/changeTransactionStatus';
import ChildTransactionsDeleteDialog from './modals/child-transaction-delete-dialog';

export const ChildTransactionReports = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const childEntity = useAppSelector(state => state.child.entity);
  const totalItems = useAppSelector(state => state.childTransactionReports.totalItems);
  const loading = useAppSelector(state => state.childTransactionReports.loading);
  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));
  const childTransactionReportList = useAppSelector(state => state.childTransactionReports.entities);
  const updateSuccess = useAppSelector(state => state.childTransactionReports.updateSuccess);
  const itemsPerPage = 5;
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(
      {
        activePage: 1,
        itemsPerPage: itemsPerPage,
        sort: sortState.sort,
        order: sortState.order,
      },
      pageLocation.search,
    ),
  );
//handle change child status
    const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState<boolean>(false);
    const [selectedTransactionReport, setSelectedTransactionReport] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<ChildTransactionRreportsStatus>(ChildTransactionRreportsStatus.PENDING);
  
    const openChangeStatusModal = (report: any) => {
      setSelectedTransactionReport(report);
      setSelectedStatus(report.status as ChildTransactionRreportsStatus);
      setIsChangeStatusModalOpen(true);
    };
  
    const closeChangeStatusModal = () => {
      setSelectedTransactionReport(null);
      setIsChangeStatusModalOpen(false);
    };
  
    const saveChildStatus = (newStatus: ChildTransactionRreportsStatus) => {
      if (selectedTransactionReport) {
        const updatedReport = {
          ...selectedTransactionReport,
          status: newStatus,
        };
        dispatch(createEntity(updatedReport));
      }
    };

  useEffect(() => {
    dispatch(getEntity(id));
  }, [dispatch, id]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setSelectedTransactionReport(null);
    setIsModalOpen(false);
  };

  const handleEdit = report => {
    setIsModalOpen(true);
    setSelectedTransactionReport(report);
  }

  const handleDelete = report => {
    setIsDeleteModalOpen(true);
    setSelectedTransactionReport(report);
  }
  const handleCancelDelete = () => {
    setSelectedTransactionReport(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteEntity = () => {
    dispatch(deleteEntity(selectedTransactionReport.id));
    handleCancelDelete();
  };

  const handlePagination = currentPage => {
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });
  };
  const saveEntity = entity => {
      entity.child = childEntity.id;
      dispatch(createEntity(entity));
      handleCancel();
  };

  const getAllEntities = () => {
    dispatch(
      getChildTransactions({
        sort: `${sortState.sort},${sortState.order}`,
        page: paginationState.activePage - 1,
        size: itemsPerPage,
        childId: parseInt(id, 10),
      }),
    );
  };
  useEffect(() => {
    if (updateSuccess) {
      dispatch(
        getChildTransactions({
          sort: `${sortState.sort},${sortState.order}`,
          page: paginationState.activePage - 1,
          size: itemsPerPage,
          childId: parseInt(id, 10),
        }),
      );
    }
  }, [updateSuccess]);
  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage, paginationState.itemsPerPage]);

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };
  return (
    <>
      <div
        className="d-flex justify-content-between"
        style={{ marginBottom: '15px', backgroundColor: '#F3F8F8F0', padding: '20px', borderRadius: '8px' }}
      >
        <div className="d-flex">
          <div>
            <img
              className="childImage"
              src={
                childEntity && childEntity.imageUrl
                  ? childEntity.imageUrl
                  : 'https://kafala-dev-s3.s3.us-west-1.amazonaws.com/43825623-8e51-438a-bd9e-84a33926a65c-child.png'
              }
              alt="Child"
            />
          </div>
          <div>
            <h2
              style={{ fontSize: '20px', fontWeight: '500', color: '#212121' }}
              className="mt-2 mb-2"
              id="child-heading"
              data-cy="ChildHeading"
            >
              {childEntity.firstName + ' ' + childEntity.fatherName + ' ' + childEntity.familyName}
            </h2>
            <p style={{ color: '#737373' }}>
              {translate('kafalaApp.child.monthlySponsorship')}:{' '}
              <span style={{ color: '#212121', fontSize: '15px' }}>
                {childEntity?.childSponsorShip?.minimumCost} {translate('kafalaApp.child.dolar')}
              </span>
            </p>
          </div>
        </div>
        <div className="d-flex mt-2">
          <button className="buttonDesign" onClick={showModal}>
            <Translate contentKey="kafalaApp.childTransactionReports.addTransactionReport">addTransactionReport</Translate>
          </button>
        </div>

        <AddTransactionReport isModalOpen={isModalOpen} handleCancel={handleCancel} currentLocale={currentLocale} saveEntity={saveEntity} transactionReport={selectedTransactionReport}/>
        <ChildTransactionsDeleteDialog isModalOpen={isDeleteModalOpen} handleCancel={handleCancelDelete} deleteEntity={confirmDeleteEntity} transactionReport={selectedTransactionReport}/>
      </div>
      <div className="table-responsive">
        {childTransactionReportList && childTransactionReportList.length > 0 ? (
          <Table responsive className="generalTable">
            <thead className="tableHeader">
              <tr>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.id">ID</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.image">Transaction Image</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.Video">Transaction Video</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.description">Description</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.amountReceived">Amount Received</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.createdBy">Created By</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.status.title">Status</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childTransactionReports.changeStatus">Change Status</Translate>
                </th>
                <th><Translate contentKey="kafalaApp.childTransactionReports.options">options</Translate></th>
              </tr>
            </thead>
            <tbody>
              {childTransactionReportList?.map((report, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{report.id || '...'}</td>
                  <td>
                    {report.image ? (
                      <img style={{ width: '114px', height: '80px' }} src={report.image} alt="Transaction Image" />
                    ) : (
                      <span style={{ marginRight: '20px', marginLeft: '20px', fontSize: '20px' }}>...</span>
                    )}
                  </td>
                  <td>
                    {report.video ? (
                      <div style={{ width: '200px', height: '120px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                        <video
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          controls
                        >
                          <source src={report.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <span style={{ fontSize: '16px', padding: '0 20px' }}>...</span>
                    )}
                  </td>
                  <td>{report.desceription || '...'}</td>
                  <td>{report.amount_received ?? '...'}</td>
                  <td>{report.createdBy || '...'}</td>
                  <td>{translate(`kafalaApp.childTransactionReports.status.${report.status}`)}</td>
                  <td className="nowrap">
                    <button 
                      className="btn btn-success" 
                      onClick={() => openChangeStatusModal(report)}
                    >
                      <Translate contentKey="kafalaApp.childTransactionReports.changeStatus">Change Status</Translate>
                    </button>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        as="span"
                        id="dropdown-basic"
                        className="td-dots-button"
                        style={{ cursor: 'pointer', display: 'inline-block', backgroundColor: 'transparent', border: 'none' }}
                      >
                        <img src="../../../content/images/dots-vertical.png" alt="dots" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEdit(report)}>
                          <Translate contentKey="kafalaApp.childTransactionReports.editTransaction">Edit Report</Translate>
                        </Dropdown.Item>
                          <Dropdown.Item style={{ color: 'red' }} onClick={() => handleDelete(report)}>
                            <Translate contentKey="kafalaApp.childTransactionReports.deleteTransaction">Delete Report</Translate>
                          </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="kafalaApp.childTransactionReports.notFound">No Children found</Translate>
            </div>
          )
        )}
      </div>
      <ChangeTransactionStatusModal
          transactionReport={selectedTransactionReport}
          availableStatuses={[ChildTransactionRreportsStatus.PENDING, ChildTransactionRreportsStatus.APPROVED, ChildTransactionRreportsStatus.REJECTED]}
          isOpen={isChangeStatusModalOpen}
          onSubmit={saveChildStatus}
          onCancel={closeChangeStatusModal}
          updateSuccess={updateSuccess}
          loading={loading}
          selectedStatus={selectedStatus}
        />
      <div id="clientListPagination" className={childTransactionReportList && childTransactionReportList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </Row>
      </div>
    </>
  );
};

export default ChildTransactionReports;

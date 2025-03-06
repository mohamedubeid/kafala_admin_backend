import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiItemCount, JhiPagination, translate } from 'react-jhipster';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams, overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntities, getEntity, updateEntity } from './rel-child-kafeel.reducer';
import { IRelChildKafeel } from 'app/shared/model/rel-child-kafeel.model';
import ChangeChildKafeelStatusModal from './change-kafel-status-modal';
import { RelChildKafeelStatus } from 'app/shared/model/enumerations/rel-child-kafeel-status.model';

export const RelChildKafeel = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState<boolean>(false);
  const [nationalId, setNationalId] = useState('');

  const relChildKafeelList = useAppSelector(state => state.relChildKafeel.entities);
  const totalItems = useAppSelector(state => state.relChildKafeel.totalItems);
  const loading = useAppSelector(state => state.relChildKafeel.loading);
  const updateSuccess = useAppSelector(state => state.relChildKafeel.updateSuccess);

  const [availableStatuses, setAvailableStatuses] = useState<RelChildKafeelStatus[]>([
    RelChildKafeelStatus.ACCEPTED,
    RelChildKafeelStatus.PENDING,
    RelChildKafeelStatus.REJECTED,
  ]);
  const [selectedRelChildKafeel, setSelectedRelChildKafeel] = useState<IRelChildKafeel | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RelChildKafeelStatus>();
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(
      {
        activePage: 1,
        itemsPerPage: ITEMS_PER_PAGE,
        sort: sortState.sort,
        order: sortState.order,
      },
      pageLocation.search,
    ),
  );
  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        nationalId: nationalId,
      }),
    );
  };

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
  useEffect(() => {
    getAllEntities();
  }, [sortState.order, sortState.sort, paginationState.activePage, paginationState.itemsPerPage, nationalId]);
  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage => {
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });
  };
  const openChangeStatusModal = (relChildKafeel: IRelChildKafeel) => {
    setSelectedRelChildKafeel(relChildKafeel);
    dispatch(getEntity(relChildKafeel.id));
    setSelectedStatus(relChildKafeel.status as RelChildKafeelStatus);
    setIsChangeStatusModalOpen(true);
  };

  useEffect(() => {
    if (updateSuccess) {
      dispatch(
        getEntities({
          sort: `${sortState.sort},${sortState.order}`,
          page: paginationState.activePage - 1,
          size: paginationState.itemsPerPage,
        }),
      );
    }
  }, [updateSuccess, dispatch, sortState, paginationState, isChangeStatusModalOpen]);
  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const saveEntity = (newStatus: RelChildKafeelStatus) => {
    if (selectedRelChildKafeel) {
      const entity = {
        ...selectedRelChildKafeel,
        status: newStatus,
      };
      dispatch(updateEntity(entity));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNationalId(e.target.value);
  };

  return (
    <div>
      <h2 className="mb-4">sponsorships</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="position-relative" style={{ width: '300px' }}>
            <FontAwesomeIcon
              icon={faSearch}
              className="position-absolute"
              style={{
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                zIndex: 1,
              }}
            />
            <input
              type="text"
              className="form-control rounded-pill"
              style={{
                paddingLeft: '35px',
                paddingRight: '15px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
              }}
              placeholder={translate('kafalaApp.child.nationalId')}
              value={nationalId}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive">
        {relChildKafeelList && relChildKafeelList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="kafalaApp.child.nationalId">National ID</Translate>
                </th>
                <th className="hand" onClick={sort('duration')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.duration">Duration</Translate>{' '}
                </th>
                <th className="hand" onClick={sort('cost')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.cost">Cost</Translate>{' '}
                </th>
                <th className="hand" onClick={sort('expirationDate')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.expirationDate">Expiration Date</Translate>{' '}
                </th>
                <th className="hand" onClick={sort('startDate')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.startDate">Start Date</Translate>{' '}
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.status">Status</Translate>{' '}
                </th>
                <th>
                  <Translate contentKey="kafalaApp.relChildKafeel.child">Child</Translate>
                </th>
                <th>
                  <Translate contentKey="kafalaApp.relChildKafeel.kafeel">Kafeel</Translate>
                </th>
                <th>
                  <Translate contentKey="kafalaApp.relChildKafeel.changeStatus">change status</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {relChildKafeelList.map((relChildKafeel, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{relChildKafeel.id}</td>
                  <td>{relChildKafeel.child ? relChildKafeel.child.nationalId || '' : ''}</td>
                  <td>
                    <Translate contentKey={`kafalaApp.childSponsorShip.${relChildKafeel.duration}`} />
                  </td>
                  <td>{relChildKafeel.cost}</td>
                  <td>
                    {relChildKafeel.expirationDate ? (
                      <TextFormat type="date" value={relChildKafeel.expirationDate} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {relChildKafeel.startDate ? (
                      <TextFormat type="date" value={relChildKafeel.startDate} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{translate(`kafalaApp.RelChildKafeelStatus.${relChildKafeel.status}`)}</td>
                  <td>
                    {relChildKafeel.child
                      ? (relChildKafeel.child.firstName || '') +
                        (relChildKafeel.child.fatherName ? ' ' + relChildKafeel.child.fatherName : '') +
                        (relChildKafeel.child.familyName ? ' ' + relChildKafeel.child.familyName : '')
                      : ''}
                  </td>
                  <td>
                    {relChildKafeel.kafeel && relChildKafeel.kafeel.user
                      ? (relChildKafeel.kafeel.user.firstName || '') +
                        (relChildKafeel.kafeel.user.lastName ? ' ' + relChildKafeel.kafeel.user.lastName : '')
                      : ''}
                  </td>
                  <td className="">
                    <div className="btn-group flex-btn-group-container">
                      <td className="nowrap">
                        <Button className="btn btn-success" onClick={() => openChangeStatusModal(relChildKafeel)}>
                          <Translate contentKey="kafalaApp.relChildKafeel.changeStatus">Change Status</Translate>
                        </Button>
                      </td>
                      {/* <Button tag={Link} to={`/rel-child-kafeel/${relChildKafeel.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button> */}
                      {/* <Button
                        tag={Link}
                        to={`/rel-child-kafeel/${relChildKafeel.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/rel-child-kafeel/${relChildKafeel.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="kafalaApp.relChildKafeel.home.notFound">No Rel Child Kafeels found</Translate>
            </div>
          )
        )}
      </div>
      <ChangeChildKafeelStatusModal
        childKafeel={selectedRelChildKafeel}
        availableStatuses={availableStatuses}
        isOpen={isChangeStatusModalOpen}
        onSubmit={saveEntity}
        onCancel={closeChangeStatusModal}
        updateSuccess={updateSuccess}
        loading={loading}
        selectedStatus={selectedStatus}
      />
      <div id="clientListPagination" className={relChildKafeelList && relChildKafeelList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

export default RelChildKafeel;

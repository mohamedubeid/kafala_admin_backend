import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSortState, JhiItemCount, JhiPagination, Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createEntity, getChildParticipations } from '../child-prticipations-extend/child-prticipations.reducer';
import AddParticipation from 'app/modals/addParticipations';
import { getEntity } from './child.reducer';
import { toast } from 'react-toastify';
import { Row, Table } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams, overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';

export const ChildParticipations = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const childEntity = useAppSelector(state => state.child.entity);
  const totalItems = useAppSelector(state => state.ChildParticipations.totalItems);
  const loading = useAppSelector(state => state.ChildParticipations.loading);
  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));
  const childPrticipationsList = useAppSelector(state => state.ChildParticipations.entities);
  const updateSuccess = useAppSelector(state => state.ChildParticipations.updateSuccess);
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
  useEffect(() => {
    dispatch(getEntity(id));
  }, [dispatch, id]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handlePagination = currentPage => {
    console.log('currecntPage', currentPage);
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });
  };
  const saveEntity = entity => {
    if ((!entity.image || entity.image === '') && (!entity.desceription || entity.desceription === '')) {
      toast.warning(translate('kafalaApp.child.FillDataWarning'));
    } else {
      entity.child = childEntity.id;
      dispatch(createEntity(entity));
      handleCancel();
    }
  };

  const getAllEntities = () => {
    dispatch(
      getChildParticipations({
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
        getChildParticipations({
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
              style={{ fontSize: '32px', fontWeight: '600', color: '#212121' }}
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
            <Translate contentKey="kafalaApp.child.addParticipation">addParticipation</Translate>
          </button>
        </div>

        <AddParticipation isModalOpen={isModalOpen} handleCancel={handleCancel} currentLocale={currentLocale} saveEntity={saveEntity} />
      </div>
      <div className="table-responsive">
        {childPrticipationsList && childPrticipationsList.length > 0 ? (
          <Table responsive className="generalTable">
            <thead className="tableHeader">
              <tr>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childPrticipations.participatipnImage">participation image</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childPrticipations.participationType">participationType</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.childPrticipations.description">description</Translate>
                </th>
              </tr>
            </thead>
            <tbody>
              {childPrticipationsList?.map((participate, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    {participate.image ? (
                      <img style={{ width: '114px', height: '80px' }} src={participate.image} />
                    ) : (
                      <span style={{ marginRight: '20px', marginLeft: '20px', fontSize: '20px' }}>...</span>
                    )}
                  </td>
                  <td>
                    <Translate contentKey={`kafalaApp.childPrticipations.${participate.participationType}`} />
                  </td>
                  <td>
                    {participate.desceription ? (
                      participate.desceription
                    ) : (
                      <span style={{ marginRight: '20px', marginLeft: '20px', fontSize: '20px' }}>...</span>
                    )}
                  </td>
                  {/* <td>
                  <img
                    style={{ cursor: 'pointer' }}
                    onClick={() => (window.location.href = `/child-prticipations/${participate.id}/delete`)}
                    src="../../../content/images/delete.png"
                  />
                </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="kafalaApp.childPrticipations.notFound">No Children found</Translate>
            </div>
          )
        )}
      </div>
      <div id="clientListPagination" className={childPrticipationsList && childPrticipationsList.length > 0 ? '' : 'd-none'}>
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

export default ChildParticipations;

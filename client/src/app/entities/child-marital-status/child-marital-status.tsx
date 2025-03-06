import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './child-marital-status.reducer';

export const ChildMaritalStatus = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childMaritalStatusList = useAppSelector(state => state.childMaritalStatus.entities);
  const loading = useAppSelector(state => state.childMaritalStatus.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
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

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="child-marital-status-heading" data-cy="ChildMaritalStatusHeading">
        <Translate contentKey="kafalaApp.childMaritalStatus.home.title">Child Marital Statuses</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.childMaritalStatus.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/child-marital-status/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.childMaritalStatus.home.createLabel">Create new Child Marital Status</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {childMaritalStatusList && childMaritalStatusList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('orphanClassification')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.orphanClassification">Orphan Classification</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('orphanClassification')} />
                </th>
                <th className="hand" onClick={sort('fatherDateOfDeath')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.fatherDateOfDeath">Father Date Of Death</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fatherDateOfDeath')} />
                </th>
                <th className="hand" onClick={sort('guardianName')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.guardianName">Guardian Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('guardianName')} />
                </th>
                <th className="hand" onClick={sort('guardianNationalID')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.guardianNationalID">Guardian National ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('guardianNationalID')} />
                </th>
                <th className="hand" onClick={sort('guardianRelationship')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.guardianRelationship">Guardian Relationship</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('guardianRelationship')} />
                </th>
                <th className="hand" onClick={sort('guardianDocument')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.guardianDocument">Guardian Document</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('guardianDocument')} />
                </th>
                <th className="hand" onClick={sort('dateOfBeathImage')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.dateOfBeathImage">Date Of Beath Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateOfBeathImage')} />
                </th>
                <th className="hand" onClick={sort('numOfSibiling')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.numOfSibiling">Num Of Sibiling</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('numOfSibiling')} />
                </th>
                <th className="hand" onClick={sort('lostHousing')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.lostHousing">Lost Housing</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lostHousing')} />
                </th>
                <th className="hand" onClick={sort('lostLimbs')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.lostLimbs">Lost Limbs</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lostLimbs')} />
                </th>
                <th className="hand" onClick={sort('lostSight')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.lostSight">Lost Sight</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lostSight')} />
                </th>
                <th className="hand" onClick={sort('losthearorspeak')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.losthearorspeak">Losthearorspeak</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('losthearorspeak')} />
                </th>
                <th className="hand" onClick={sort('hasChronicDiseases')}>
                  <Translate contentKey="kafalaApp.childMaritalStatus.hasChronicDiseases">Has Chronic Diseases</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hasChronicDiseases')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.childMaritalStatus.child">Child</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {childMaritalStatusList.map((childMaritalStatus, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/child-marital-status/${childMaritalStatus.id}`} color="link" size="sm">
                      {childMaritalStatus.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`kafalaApp.OrphanClassification.${childMaritalStatus.orphanClassification}`} />
                  </td>
                  <td>
                    {childMaritalStatus.fatherDateOfDeath ? (
                      <TextFormat type="date" value={childMaritalStatus.fatherDateOfDeath} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{childMaritalStatus.guardianName}</td>
                  <td>{childMaritalStatus.guardianNationalID}</td>
                  <td>{childMaritalStatus.guardianRelationship}</td>
                  <td>{childMaritalStatus.guardianDocument}</td>
                  <td>{childMaritalStatus.dateOfBeathImage}</td>
                  <td>{childMaritalStatus.numOfSibiling}</td>
                  <td>{childMaritalStatus.lostHousing ? 'true' : 'false'}</td>
                  <td>{childMaritalStatus.lostLimbs ? 'true' : 'false'}</td>
                  <td>{childMaritalStatus.lostSight ? 'true' : 'false'}</td>
                  <td>{childMaritalStatus.losthearorspeak ? 'true' : 'false'}</td>
                  <td>{childMaritalStatus.hasChronicDiseases ? 'true' : 'false'}</td>
                  <td>
                    {childMaritalStatus.child ? (
                      <Link to={`/child/${childMaritalStatus.child.id}`}>{childMaritalStatus.child.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/child-marital-status/${childMaritalStatus.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/child-marital-status/${childMaritalStatus.id}/edit`}
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
                        onClick={() => (window.location.href = `/child-marital-status/${childMaritalStatus.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="kafalaApp.childMaritalStatus.home.notFound">No Child Marital Statuses found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChildMaritalStatus;

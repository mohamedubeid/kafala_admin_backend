import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './child-health-status.reducer';

export const ChildHealthStatus = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childHealthStatusList = useAppSelector(state => state.childHealthStatus.entities);
  const loading = useAppSelector(state => state.childHealthStatus.loading);

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
      <h2 id="child-health-status-heading" data-cy="ChildHealthStatusHeading">
        <Translate contentKey="kafalaApp.childHealthStatus.home.title">Child Health Statuses</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.childHealthStatus.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/child-health-status/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.childHealthStatus.home.createLabel">Create new Child Health Status</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {childHealthStatusList && childHealthStatusList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('healthStatus')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.healthStatus">Health Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('healthStatus')} />
                </th>
                <th className="hand" onClick={sort('chronicDisease')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.chronicDisease">Chronic Disease</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('chronicDisease')} />
                </th>
                <th className="hand" onClick={sort('hasDisability')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.hasDisability">Has Disability</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hasDisability')} />
                </th>
                <th className="hand" onClick={sort('disabilityType')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.disabilityType">Disability Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('disabilityType')} />
                </th>
                <th className="hand" onClick={sort('disabilityImage')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.disabilityImage">Disability Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('disabilityImage')} />
                </th>
                <th className="hand" onClick={sort('hasMentalIllness')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.hasMentalIllness">Has Mental Illness</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hasMentalIllness')} />
                </th>
                <th className="hand" onClick={sort('mentalIllnessType')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.mentalIllnessType">Mental Illness Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('mentalIllnessType')} />
                </th>
                <th className="hand" onClick={sort('mentalIllnessImage')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.mentalIllnessImage">Mental Illness Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('mentalIllnessImage')} />
                </th>
                <th className="hand" onClick={sort('sychologicalHealth')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.sychologicalHealth">Sychological Health</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sychologicalHealth')} />
                </th>
                <th className="hand" onClick={sort('sychologicalHealthType')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.sychologicalHealthType">Sychological Health Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sychologicalHealthType')} />
                </th>
                <th className="hand" onClick={sort('sychologicalHealthImage')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.sychologicalHealthImage">Sychological Health Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sychologicalHealthImage')} />
                </th>
                <th className="hand" onClick={sort('healthReport')}>
                  <Translate contentKey="kafalaApp.childHealthStatus.healthReport">Health Report</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('healthReport')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.childHealthStatus.child">Child</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {childHealthStatusList.map((childHealthStatus, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/child-health-status/${childHealthStatus.id}`} color="link" size="sm">
                      {childHealthStatus.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`kafalaApp.HealthStatus.${childHealthStatus.healthStatus}`} />
                  </td>
                  <td>{childHealthStatus.chronicDisease ? 'true' : 'false'}</td>
                  <td>{childHealthStatus.hasDisability ? 'true' : 'false'}</td>
                  <td>
                    <Translate contentKey={`kafalaApp.DisabilityTypes.${childHealthStatus.disabilityType}`} />
                  </td>
                  <td>{childHealthStatus.disabilityImage}</td>
                  <td>{childHealthStatus.hasMentalIllness ? 'true' : 'false'}</td>
                  <td>
                    <Translate contentKey={`kafalaApp.MentalIllnessTypes.${childHealthStatus.mentalIllnessType}`} />
                  </td>
                  <td>{childHealthStatus.mentalIllnessImage}</td>
                  <td>{childHealthStatus.sychologicalHealth ? 'true' : 'false'}</td>
                  <td>
                    <Translate contentKey={`kafalaApp.SychologicalHealthTypes.${childHealthStatus.sychologicalHealthType}`} />
                  </td>
                  <td>{childHealthStatus.sychologicalHealthImage}</td>
                  <td>{childHealthStatus.healthReport}</td>
                  <td>
                    {childHealthStatus.child ? <Link to={`/child/${childHealthStatus.child.id}`}>{childHealthStatus.child.id}</Link> : ''}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/child-health-status/${childHealthStatus.id}`}
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
                        to={`/child-health-status/${childHealthStatus.id}/edit`}
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
                        onClick={() => (window.location.href = `/child-health-status/${childHealthStatus.id}/delete`)}
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
              <Translate contentKey="kafalaApp.childHealthStatus.home.notFound">No Child Health Statuses found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChildHealthStatus;

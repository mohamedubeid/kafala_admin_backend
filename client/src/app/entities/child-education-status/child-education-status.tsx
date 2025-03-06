import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './child-education-status.reducer';

export const ChildEducationStatus = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childEducationStatusList = useAppSelector(state => state.childEducationStatus.entities);
  const loading = useAppSelector(state => state.childEducationStatus.loading);

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
      <h2 id="child-education-status-heading" data-cy="ChildEducationStatusHeading">
        <Translate contentKey="kafalaApp.childEducationStatus.home.title">Child Education Statuses</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.childEducationStatus.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/child-education-status/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.childEducationStatus.home.createLabel">Create new Child Education Status</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {childEducationStatusList && childEducationStatusList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.childEducationStatus.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('lastLevelOfEducation')}>
                  <Translate contentKey="kafalaApp.childEducationStatus.lastLevelOfEducation">Last Level Of Education</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lastLevelOfEducation')} />
                </th>
                <th className="hand" onClick={sort('hoppy')}>
                  <Translate contentKey="kafalaApp.childEducationStatus.hoppy">Hoppy</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hoppy')} />
                </th>
                <th className="hand" onClick={sort('lastLevelOfEducationImage')}>
                  <Translate contentKey="kafalaApp.childEducationStatus.lastLevelOfEducationImage">Last Level Of Education Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lastLevelOfEducationImage')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.childEducationStatus.child">Child</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {childEducationStatusList.map((childEducationStatus, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/child-education-status/${childEducationStatus.id}`} color="link" size="sm">
                      {childEducationStatus.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`kafalaApp.LastLevelOfEducation.${childEducationStatus.lastLevelOfEducation}`} />
                  </td>
                  <td>{childEducationStatus.hoppy}</td>
                  <td>{childEducationStatus.lastLevelOfEducationImage}</td>
                  <td>
                    {childEducationStatus.child ? (
                      <Link to={`/child/${childEducationStatus.child.id}`}>{childEducationStatus.child.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/child-education-status/${childEducationStatus.id}`}
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
                        to={`/child-education-status/${childEducationStatus.id}/edit`}
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
                        onClick={() => (window.location.href = `/child-education-status/${childEducationStatus.id}/delete`)}
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
              <Translate contentKey="kafalaApp.childEducationStatus.home.notFound">No Child Education Statuses found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChildEducationStatus;

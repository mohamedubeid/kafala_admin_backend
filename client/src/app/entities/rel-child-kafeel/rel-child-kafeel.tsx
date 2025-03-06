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

import { getEntities } from './rel-child-kafeel.reducer';

export const RelChildKafeel = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const relChildKafeelList = useAppSelector(state => state.relChildKafeel.entities);
  const loading = useAppSelector(state => state.relChildKafeel.loading);

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
      <h2 id="rel-child-kafeel-heading" data-cy="RelChildKafeelHeading">
        <Translate contentKey="kafalaApp.relChildKafeel.home.title">Rel Child Kafeels</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.relChildKafeel.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/rel-child-kafeel/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.relChildKafeel.home.createLabel">Create new Rel Child Kafeel</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {relChildKafeelList && relChildKafeelList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('duration')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.duration">Duration</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('duration')} />
                </th>
                <th className="hand" onClick={sort('cost')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.cost">Cost</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('cost')} />
                </th>
                <th className="hand" onClick={sort('expirationDate')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.expirationDate">Expiration Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('expirationDate')} />
                </th>
                <th className="hand" onClick={sort('startDate')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.startDate">Start Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('startDate')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.relChildKafeel.child">Child</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.relChildKafeel.kafeel">Kafeel</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {relChildKafeelList.map((relChildKafeel, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/rel-child-kafeel/${relChildKafeel.id}`} color="link" size="sm">
                      {relChildKafeel.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`kafalaApp.SponsershipDuration.${relChildKafeel.duration}`} />
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
                  <td>
                    <Translate contentKey={`kafalaApp.RelChildKafeelStatus.${relChildKafeel.status}`} />
                  </td>
                  <td>{relChildKafeel.child ? <Link to={`/child/${relChildKafeel.child.id}`}>{relChildKafeel.child.id}</Link> : ''}</td>
                  <td>{relChildKafeel.kafeel ? <Link to={`/kafeel/${relChildKafeel.kafeel.id}`}>{relChildKafeel.kafeel.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/rel-child-kafeel/${relChildKafeel.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
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
              <Translate contentKey="kafalaApp.relChildKafeel.home.notFound">No Rel Child Kafeels found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RelChildKafeel;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './child-prticipations.reducer';

export const ChildPrticipations = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childPrticipationsList = useAppSelector(state => state.childPrticipations.entities);
  const loading = useAppSelector(state => state.childPrticipations.loading);

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
      <h2 id="child-prticipations-heading" data-cy="ChildPrticipationsHeading">
        <Translate contentKey="kafalaApp.childPrticipations.home.title">Child Prticipations</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.childPrticipations.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/child-prticipations/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.childPrticipations.home.createLabel">Create new Child Prticipations</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {childPrticipationsList && childPrticipationsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.childPrticipations.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('participationType')}>
                  <Translate contentKey="kafalaApp.childPrticipations.participationType">Participation Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('participationType')} />
                </th>
                <th className="hand" onClick={sort('image')}>
                  <Translate contentKey="kafalaApp.childPrticipations.image">Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('image')} />
                </th>
                <th className="hand" onClick={sort('desceription')}>
                  <Translate contentKey="kafalaApp.childPrticipations.desceription">Desceription</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('desceription')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.childPrticipations.child">Child</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {childPrticipationsList.map((childPrticipations, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/child-prticipations/${childPrticipations.id}`} color="link" size="sm">
                      {childPrticipations.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`kafalaApp.ParticipationTypes.${childPrticipations.participationType}`} />
                  </td>
                  <td>{childPrticipations.image}</td>
                  <td>{childPrticipations.desceription}</td>
                  <td>
                    {childPrticipations.child ? (
                      <Link to={`/child/${childPrticipations.child.id}`}>{childPrticipations.child.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/child-prticipations/${childPrticipations.id}`}
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
                        to={`/child-prticipations/${childPrticipations.id}/edit`}
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
                        onClick={() => (window.location.href = `/child-prticipations/${childPrticipations.id}/delete`)}
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
              <Translate contentKey="kafalaApp.childPrticipations.home.notFound">No Child Prticipations found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChildPrticipations;

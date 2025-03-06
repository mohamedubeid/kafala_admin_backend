import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './child-sponsor-ship-notes.reducer';

export const ChildSponsorShipNotes = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childSponsorShipNotesList = useAppSelector(state => state.childSponsorShipNotes.entities);
  const loading = useAppSelector(state => state.childSponsorShipNotes.loading);

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
      <h2 id="child-sponsor-ship-notes-heading" data-cy="ChildSponsorShipNotesHeading">
        <Translate contentKey="kafalaApp.childSponsorShipNotes.home.title">Child Sponsor Ship Notes</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.childSponsorShipNotes.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/child-sponsor-ship-notes/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.childSponsorShipNotes.home.createLabel">Create new Child Sponsor Ship Notes</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {childSponsorShipNotesList && childSponsorShipNotesList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.childSponsorShipNotes.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.childSponsorShipNotes.notes">Notes</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.childSponsorShipNotes.childSponsorShip">Child Sponsor Ship</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {childSponsorShipNotesList.map((childSponsorShipNotes, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/child-sponsor-ship-notes/${childSponsorShipNotes.id}`} color="link" size="sm">
                      {childSponsorShipNotes.id}
                    </Button>
                  </td>
                  <td>
                    {childSponsorShipNotes.notes ? (
                      <Link to={`/notes/${childSponsorShipNotes.notes.id}`}>{childSponsorShipNotes.notes.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {childSponsorShipNotes.childSponsorShip ? (
                      <Link to={`/child-sponsor-ship/${childSponsorShipNotes.childSponsorShip.id}`}>
                        {childSponsorShipNotes.childSponsorShip.id}
                      </Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/child-sponsor-ship-notes/${childSponsorShipNotes.id}`}
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
                        to={`/child-sponsor-ship-notes/${childSponsorShipNotes.id}/edit`}
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
                        onClick={() => (window.location.href = `/child-sponsor-ship-notes/${childSponsorShipNotes.id}/delete`)}
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
              <Translate contentKey="kafalaApp.childSponsorShipNotes.home.notFound">No Child Sponsor Ship Notes found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChildSponsorShipNotes;

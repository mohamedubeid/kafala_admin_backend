import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { byteSize, Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './child.reducer';

export const Child = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childList = useAppSelector(state => state.child.entities);
  const loading = useAppSelector(state => state.child.loading);

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
      <h2 id="child-heading" data-cy="ChildHeading">
        <Translate contentKey="kafalaApp.child.home.title">Children</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="kafalaApp.child.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/child/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="kafalaApp.child.home.createLabel">Create new Child</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {childList && childList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="kafalaApp.child.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('firstName')}>
                  <Translate contentKey="kafalaApp.child.firstName">First Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('firstName')} />
                </th>
                <th className="hand" onClick={sort('imageUrl')}>
                  <Translate contentKey="kafalaApp.child.imageUrl">Image Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('imageUrl')} />
                </th>
                <th className="hand" onClick={sort('nationalId')}>
                  <Translate contentKey="kafalaApp.child.nationalId">National Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nationalId')} />
                </th>
                <th className="hand" onClick={sort('nationalImage')}>
                  <Translate contentKey="kafalaApp.child.nationalImage">National Image</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nationalImage')} />
                </th>
                <th className="hand" onClick={sort('birthCertificate')}>
                  <Translate contentKey="kafalaApp.child.birthCertificate">Birth Certificate</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('birthCertificate')} />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="kafalaApp.child.email">Email</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </th>
                <th className="hand" onClick={sort('fatherName')}>
                  <Translate contentKey="kafalaApp.child.fatherName">Father Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fatherName')} />
                </th>
                <th className="hand" onClick={sort('fatherPhone')}>
                  <Translate contentKey="kafalaApp.child.fatherPhone">Father Phone</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fatherPhone')} />
                </th>
                <th className="hand" onClick={sort('brotherCode')}>
                  <Translate contentKey="kafalaApp.child.brotherCode">Brother Code</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('brotherCode')} />
                </th>
                <th className="hand" onClick={sort('motherName')}>
                  <Translate contentKey="kafalaApp.child.motherName">Mother Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('motherName')} />
                </th>
                <th className="hand" onClick={sort('familyName')}>
                  <Translate contentKey="kafalaApp.child.familyName">Family Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('familyName')} />
                </th>
                <th className="hand" onClick={sort('gender')}>
                  <Translate contentKey="kafalaApp.child.gender">Gender</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('gender')} />
                </th>
                <th className="hand" onClick={sort('age')}>
                  <Translate contentKey="kafalaApp.child.age">Age</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('age')} />
                </th>
                <th className="hand" onClick={sort('vedio')}>
                  <Translate contentKey="kafalaApp.child.vedio">Vedio</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('vedio')} />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="kafalaApp.child.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                </th>
                <th className="hand" onClick={sort('address')}>
                  <Translate contentKey="kafalaApp.child.address">Address</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('address')} />
                </th>
                <th className="hand" onClick={sort('score')}>
                  <Translate contentKey="kafalaApp.child.score">Score</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('score')} />
                </th>
                <th>
                  <Translate contentKey="kafalaApp.child.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {childList.map((child, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/child/${child.id}`} color="link" size="sm">
                      {child.id}
                    </Button>
                  </td>
                  <td>{child.firstName}</td>
                  <td>{child.imageUrl}</td>
                  <td>{child.nationalId}</td>
                  <td>{child.nationalImage}</td>
                  <td>{child.birthCertificate}</td>
                  <td>{child.email}</td>
                  <td>{child.fatherName}</td>
                  <td>{child.fatherPhone}</td>
                  <td>{child.brotherCode}</td>
                  <td>{child.motherName}</td>
                  <td>{child.familyName}</td>
                  <td>
                    <Translate contentKey={`kafalaApp.Gender.${child.gender}`} />
                  </td>
                  <td>{child.age}</td>
                  <td>{child.vedio}</td>
                  <td>{child.description}</td>
                  <td>{child.address}</td>
                  <td>{child.score}</td>
                  <td>{child.user ? child.user.id : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/child/${child.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/child/${child.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/child/${child.id}/delete`)}
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
              <Translate contentKey="kafalaApp.child.home.notFound">No Children found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Child;

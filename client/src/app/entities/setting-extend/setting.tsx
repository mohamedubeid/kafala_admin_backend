import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { byteSize, Translate, getSortState, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './setting.reducer';

export const Setting = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const settingList = useAppSelector(state => state.setting.entities);
  const loading = useAppSelector(state => state.setting.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  // const sort = p => () => {
  //   setSortState({
  //     ...sortState,
  //     order: sortState.order === ASC ? DESC : ASC,
  //     sort: p,
  //   });
  // };

  // const handleSyncList = () => {
  //   sortEntities();
  // };

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
      <h2 id="setting-heading" data-cy="SettingHeading">
        <Translate contentKey="kafalaApp.setting.home.title">Settings</Translate>
      </h2>
      <div className="table-responsive">
        {settingList && settingList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand">
                  <Translate contentKey="kafalaApp.setting.id">ID</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.setting.key">Key</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.setting.value">Value</Translate>{' '}
                  {/* <FontAwesomeIcon icon={getSortIconByFieldName('value')} /> */}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {settingList.map((setting, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/setting/${setting.id}`} color="link" size="sm">
                      {setting.id}
                    </Button>
                  </td>
                  <td>{translate(`kafalaApp.setting.${setting.key}`)}</td>
                  <td>{setting.value}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/setting/${setting.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
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
              <Translate contentKey="kafalaApp.setting.home.notFound">No Settings found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Setting;

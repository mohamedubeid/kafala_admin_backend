import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Setting from './setting';
import SettingDetail from './setting-detail';
import SettingUpdate from './setting-update';
import SettingDeleteDialog from './setting-delete-dialog';

const SettingRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Setting />} />
    <Route path="new" element={<SettingUpdate />} />
    <Route path=":id">
      <Route index element={<SettingDetail />} />
      <Route path="edit" element={<SettingUpdate />} />
      <Route path="delete" element={<SettingDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SettingRoutes;

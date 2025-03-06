import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildMaritalStatus from './child-marital-status';
import ChildMaritalStatusDetail from './child-marital-status-detail';
import ChildMaritalStatusUpdate from './child-marital-status-update';
import ChildMaritalStatusDeleteDialog from './child-marital-status-delete-dialog';

const ChildMaritalStatusRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildMaritalStatus />} />
    <Route path="new" element={<ChildMaritalStatusUpdate />} />
    <Route path=":id">
      <Route index element={<ChildMaritalStatusDetail />} />
      <Route path="edit" element={<ChildMaritalStatusUpdate />} />
      <Route path="delete" element={<ChildMaritalStatusDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildMaritalStatusRoutes;

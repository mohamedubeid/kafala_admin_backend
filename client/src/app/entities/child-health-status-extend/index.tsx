import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildHealthStatus from './child-health-status';
import ChildHealthStatusDetail from './child-health-status-detail';
import ChildHealthStatusUpdate from './child-health-status-update';
import ChildHealthStatusDeleteDialog from './child-health-status-delete-dialog';

const ChildHealthStatusRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildHealthStatus />} />
    <Route path="new" element={<ChildHealthStatusUpdate />} />
    <Route path=":id">
      <Route index element={<ChildHealthStatusDetail />} />
      <Route path="edit" element={<ChildHealthStatusUpdate />} />
      <Route path="delete" element={<ChildHealthStatusDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildHealthStatusRoutes;

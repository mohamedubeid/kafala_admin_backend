import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildEducationStatus from './child-education-status';
import ChildEducationStatusDetail from './child-education-status-detail';
import ChildEducationStatusUpdate from './child-education-status-update';
import ChildEducationStatusDeleteDialog from './child-education-status-delete-dialog';

const ChildEducationStatusRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildEducationStatus />} />
    <Route path="new" element={<ChildEducationStatusUpdate />} />
    <Route path=":id">
      <Route index element={<ChildEducationStatusDetail />} />
      <Route path="edit" element={<ChildEducationStatusUpdate />} />
      <Route path="delete" element={<ChildEducationStatusDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildEducationStatusRoutes;

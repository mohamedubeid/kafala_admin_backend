import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildPrticipations from './child-prticipations';
import ChildPrticipationsDetail from './child-prticipations-detail';
import ChildPrticipationsUpdate from './child-prticipations-update';
import ChildPrticipationsDeleteDialog from './child-prticipations-delete-dialog';

const ChildPrticipationsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildPrticipations />} />
    <Route path="new" element={<ChildPrticipationsUpdate />} />
    <Route path=":id">
      <Route index element={<ChildPrticipationsDetail />} />
      <Route path="edit" element={<ChildPrticipationsUpdate />} />
      <Route path="delete" element={<ChildPrticipationsDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildPrticipationsRoutes;

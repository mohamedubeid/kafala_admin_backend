import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RelChildKafeel from './rel-child-kafeel';
import RelChildKafeelDetail from './rel-child-kafeel-detail';
import RelChildKafeelUpdate from './rel-child-kafeel-update';
import RelChildKafeelDeleteDialog from './rel-child-kafeel-delete-dialog';

const RelChildKafeelRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<RelChildKafeel />} />
    <Route path="new" element={<RelChildKafeelUpdate />} />
    <Route path=":id">
      <Route index element={<RelChildKafeelDetail />} />
      <Route path="edit" element={<RelChildKafeelUpdate />} />
      <Route path="delete" element={<RelChildKafeelDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RelChildKafeelRoutes;

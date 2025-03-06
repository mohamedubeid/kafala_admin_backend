import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Kafeel from './kafeel';
import KafeelDetail from './kafeel-detail';
import KafeelUpdate from './kafeel-update';
import KafeelDeleteDialog from './kafeel-delete-dialog';

const KafeelRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Kafeel />} />
    <Route path="new" element={<KafeelUpdate />} />
    <Route path=":id">
      <Route index element={<KafeelDetail />} />
      <Route path="edit" element={<KafeelUpdate />} />
      <Route path="delete" element={<KafeelDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default KafeelRoutes;

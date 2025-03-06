import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RelSponsershipTypes from './rel-sponsership-types';
import RelSponsershipTypesDetail from './rel-sponsership-types-detail';
import RelSponsershipTypesUpdate from './rel-sponsership-types-update';
import RelSponsershipTypesDeleteDialog from './rel-sponsership-types-delete-dialog';

const RelSponsershipTypesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<RelSponsershipTypes />} />
    <Route path="new" element={<RelSponsershipTypesUpdate />} />
    <Route path=":id">
      <Route index element={<RelSponsershipTypesDetail />} />
      <Route path="edit" element={<RelSponsershipTypesUpdate />} />
      <Route path="delete" element={<RelSponsershipTypesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RelSponsershipTypesRoutes;

import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SponsershipTypes from './sponsership-types';
import SponsershipTypesDetail from './sponsership-types-detail';
import SponsershipTypesUpdate from './sponsership-types-update';
import SponsershipTypesDeleteDialog from './sponsership-types-delete-dialog';

const SponsershipTypesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SponsershipTypes />} />
    <Route path="new" element={<SponsershipTypesUpdate />} />
    <Route path=":id">
      <Route index element={<SponsershipTypesDetail />} />
      <Route path="edit" element={<SponsershipTypesUpdate />} />
      <Route path="delete" element={<SponsershipTypesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SponsershipTypesRoutes;

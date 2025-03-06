import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildSponsorShip from './child-sponsor-ship';
import ChildSponsorShipDetail from './child-sponsor-ship-detail';
import ChildSponsorShipUpdate from './child-sponsor-ship-update';
import ChildSponsorShipDeleteDialog from './child-sponsor-ship-delete-dialog';

const ChildSponsorShipRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildSponsorShip />} />
    <Route path="new" element={<ChildSponsorShipUpdate />} />
    <Route path=":id">
      <Route index element={<ChildSponsorShipDetail />} />
      <Route path="edit" element={<ChildSponsorShipUpdate />} />
      <Route path="delete" element={<ChildSponsorShipDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildSponsorShipRoutes;

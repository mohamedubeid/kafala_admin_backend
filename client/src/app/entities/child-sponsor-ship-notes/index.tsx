import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildSponsorShipNotes from './child-sponsor-ship-notes';
import ChildSponsorShipNotesDetail from './child-sponsor-ship-notes-detail';
import ChildSponsorShipNotesUpdate from './child-sponsor-ship-notes-update';
import ChildSponsorShipNotesDeleteDialog from './child-sponsor-ship-notes-delete-dialog';

const ChildSponsorShipNotesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildSponsorShipNotes />} />
    <Route path="new" element={<ChildSponsorShipNotesUpdate />} />
    <Route path=":id">
      <Route index element={<ChildSponsorShipNotesDetail />} />
      <Route path="edit" element={<ChildSponsorShipNotesUpdate />} />
      <Route path="delete" element={<ChildSponsorShipNotesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildSponsorShipNotesRoutes;

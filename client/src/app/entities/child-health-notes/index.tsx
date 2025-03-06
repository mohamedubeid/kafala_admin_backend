import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildHealthNotes from './child-health-notes';
import ChildHealthNotesDetail from './child-health-notes-detail';
import ChildHealthNotesUpdate from './child-health-notes-update';
import ChildHealthNotesDeleteDialog from './child-health-notes-delete-dialog';

const ChildHealthNotesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildHealthNotes />} />
    <Route path="new" element={<ChildHealthNotesUpdate />} />
    <Route path=":id">
      <Route index element={<ChildHealthNotesDetail />} />
      <Route path="edit" element={<ChildHealthNotesUpdate />} />
      <Route path="delete" element={<ChildHealthNotesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildHealthNotesRoutes;

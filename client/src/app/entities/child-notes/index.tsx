import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildNotes from './child-notes';
import ChildNotesDetail from './child-notes-detail';
import ChildNotesUpdate from './child-notes-update';
import ChildNotesDeleteDialog from './child-notes-delete-dialog';

const ChildNotesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildNotes />} />
    <Route path="new" element={<ChildNotesUpdate />} />
    <Route path=":id">
      <Route index element={<ChildNotesDetail />} />
      <Route path="edit" element={<ChildNotesUpdate />} />
      <Route path="delete" element={<ChildNotesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildNotesRoutes;

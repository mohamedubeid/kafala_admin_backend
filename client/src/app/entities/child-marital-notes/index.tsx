import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildMaritalNotes from './child-marital-notes';
import ChildMaritalNotesDetail from './child-marital-notes-detail';
import ChildMaritalNotesUpdate from './child-marital-notes-update';
import ChildMaritalNotesDeleteDialog from './child-marital-notes-delete-dialog';

const ChildMaritalNotesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildMaritalNotes />} />
    <Route path="new" element={<ChildMaritalNotesUpdate />} />
    <Route path=":id">
      <Route index element={<ChildMaritalNotesDetail />} />
      <Route path="edit" element={<ChildMaritalNotesUpdate />} />
      <Route path="delete" element={<ChildMaritalNotesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildMaritalNotesRoutes;

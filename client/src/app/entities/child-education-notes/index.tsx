import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChildEducationNotes from './child-education-notes';
import ChildEducationNotesDetail from './child-education-notes-detail';
import ChildEducationNotesUpdate from './child-education-notes-update';
import ChildEducationNotesDeleteDialog from './child-education-notes-delete-dialog';

const ChildEducationNotesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChildEducationNotes />} />
    <Route path="new" element={<ChildEducationNotesUpdate />} />
    <Route path=":id">
      <Route index element={<ChildEducationNotesDetail />} />
      <Route path="edit" element={<ChildEducationNotesUpdate />} />
      <Route path="delete" element={<ChildEducationNotesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChildEducationNotesRoutes;

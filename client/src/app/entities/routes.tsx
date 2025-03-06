import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Child from './child-extend';
import ChildHealthStatus from './child-health-status-extend';
import ChildMaritalStatus from './child-marital-status';
import ChildEducationStatus from './child-education-status';
import ChildSponsorShip from './child-sponsor-ship';
import Notes from './notes';
import ChildHealthNotes from './child-health-notes';
import ChildMaritalNotes from './child-marital-notes';
import ChildEducationNotes from './child-education-notes';
import ChildSponsorShipNotes from './child-sponsor-ship-notes';
import { AUTHORITIES } from 'app/config/constants';
import PrivateRoute from 'app/shared/auth/private-route';
import ChildNotes from './child-notes';
import SponsershipTypes from './sponsership-types';
import RelSponsershipTypes from './rel-sponsership-types';
import Setting from './setting-extend';
import Kafeel from './kafeel';
import RelChildKafeel from './rel-child-kafeel';
import ChildPrticipations from './child-prticipations-extend';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <PrivateRoute path="child/*" hasAnyAuthorities={[AUTHORITIES.ADMIN]} element={<Child />} children={''} />
        <PrivateRoute path="child-health-status/*" hasAnyAuthorities={[AUTHORITIES.ADMIN]} element={<ChildHealthStatus />} children={''} />
        <Route path="child-marital-status/*" element={<ChildMaritalStatus />} />
        <Route path="child-education-status/*" element={<ChildEducationStatus />} />
        <Route path="child-sponsor-ship/*" element={<ChildSponsorShip />} />
        <Route path="notes/*" element={<Notes />} />
        <Route path="child-health-notes/*" element={<ChildHealthNotes />} />
        <Route path="child-marital-notes/*" element={<ChildMaritalNotes />} />
        <Route path="child-education-notes/*" element={<ChildEducationNotes />} />
        <Route path="child-sponsor-ship-notes/*" element={<ChildSponsorShipNotes />} />
        <Route path="child/*" element={<Child />} />
        <Route path="child-health-status/*" element={<ChildHealthStatus />} />
        <Route path="child-notes/*" element={<ChildNotes />} />
        <Route path="sponsership-types/*" element={<SponsershipTypes />} />
        <Route path="rel-sponsership-types/*" element={<RelSponsershipTypes />} />
        <Route path="setting/*" element={<Setting />} />
        <Route path="kafeel/*" element={<Kafeel />} />
        <Route path="rel-child-kafeel/*" element={<RelChildKafeel />} />
        <Route path="child-prticipations/*" element={<ChildPrticipations />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};

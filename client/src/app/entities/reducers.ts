import childHealthStatus from 'app/entities/child-health-status/child-health-status.reducer';
import childMaritalStatus from 'app/entities/child-marital-status/child-marital-status.reducer';
import childEducationStatus from 'app/entities/child-education-status/child-education-status.reducer';
import childSponsorShip from 'app/entities/child-sponsor-ship/child-sponsor-ship.reducer';
import notes from 'app/entities/notes/notes.reducer';
import childHealthNotes from 'app/entities/child-health-notes/child-health-notes.reducer';
import childMaritalNotes from 'app/entities/child-marital-notes/child-marital-notes.reducer';
import childEducationNotes from 'app/entities/child-education-notes/child-education-notes.reducer';
import childSponsorShipNotes from 'app/entities/child-sponsor-ship-notes/child-sponsor-ship-notes.reducer';
import childNotes from 'app/entities/child-notes/child-notes.reducer';
import sponsershipTypes from 'app/entities/sponsership-types/sponsership-types.reducer';
import relSponsershipTypes from 'app/entities/rel-sponsership-types/rel-sponsership-types.reducer';
import setting from 'app/entities/setting/setting.reducer';
import child from 'app/entities/child/child.reducer';
import kafeel from 'app/entities/kafeel/kafeel.reducer';
import ChildParticipations from 'app/entities/child-prticipations-extend/child-prticipations.reducer';
import relChildKafeel from 'app/entities/rel-child-kafeel-extended/rel-child-kafeel.reducer';
import childTransactionReports from 'app/entities/child-transaction-reports/child-transaction-reports.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  child,
  childHealthStatus,
  childMaritalStatus,
  childEducationStatus,
  childSponsorShip,
  notes,
  childHealthNotes,
  childMaritalNotes,
  childEducationNotes,
  childSponsorShipNotes,
  childNotes,
  sponsershipTypes,
  relSponsershipTypes,
  setting,
  kafeel,
  relChildKafeel,
  ChildParticipations,
  childTransactionReports
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;

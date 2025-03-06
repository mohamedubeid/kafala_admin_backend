import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/child">
        <Translate contentKey="global.menu.entities.child" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-health-status">
        <Translate contentKey="global.menu.entities.childHealthStatus" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-marital-status">
        <Translate contentKey="global.menu.entities.childMaritalStatus" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-education-status">
        <Translate contentKey="global.menu.entities.childEducationStatus" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-sponsor-ship">
        <Translate contentKey="global.menu.entities.childSponsorShip" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/notes">
        <Translate contentKey="global.menu.entities.notes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-health-notes">
        <Translate contentKey="global.menu.entities.childHealthNotes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-marital-notes">
        <Translate contentKey="global.menu.entities.childMaritalNotes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-education-notes">
        <Translate contentKey="global.menu.entities.childEducationNotes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-sponsor-ship-notes">
        <Translate contentKey="global.menu.entities.childSponsorShipNotes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-notes">
        <Translate contentKey="global.menu.entities.childNotes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/sponsership-types">
        <Translate contentKey="global.menu.entities.sponsershipTypes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/rel-sponsership-types">
        <Translate contentKey="global.menu.entities.relSponsershipTypes" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/setting">
        <Translate contentKey="global.menu.entities.setting" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/kafeel">
        <Translate contentKey="global.menu.entities.kafeel" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/rel-child-kafeel">
        <Translate contentKey="global.menu.entities.relChildKafeel" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/child-prticipations">
        <Translate contentKey="global.menu.entities.childPrticipations" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;

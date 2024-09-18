import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { PartnersTabIcon, AttributesTabIcon, GroupsTabIcon } from '../../../icons';

import RolloutGroupTab from './rollout-group-tab';
import RolloutPartnerTab from './rollout-partners-tab';
import RolloutAttributeTab from './rollout-attributes-tab';

import './../../style.scss';

export default function RolloutPartnersWizard({ id, rolloutPartnersData, handleAddGroups, handleAddAttributes, handleAddPartners, handleDetailsViewClick }) {
  return (
    <div data-testid={id}>
      <Tabs>
        <TabList aria-label="List of tabs">
          <Tab>
            <PartnersTabIcon />
            <span className="partners-tab-title">Partners</span>
          </Tab>
          <Tab>
            <AttributesTabIcon />
            <span className="partners-tab-title">Attributes</span>
          </Tab>
          <Tab>
            <GroupsTabIcon />
            <span className="partners-tab-title">Group</span>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolloutPartnerTab rolloutPartnersData={rolloutPartnersData} handleAddPartners={handleAddPartners} handleDetailsViewClick={handleDetailsViewClick} />
          </TabPanel>
          <TabPanel>
            <RolloutAttributeTab rolloutPartnersData={rolloutPartnersData} handleAddAttributes={handleAddAttributes} handleDetailsViewClick={handleDetailsViewClick} />
          </TabPanel>
          <TabPanel>
            <RolloutGroupTab rolloutPartnersData={rolloutPartnersData} handleAddGroups={handleAddGroups} handleDetailsViewClick={handleDetailsViewClick} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

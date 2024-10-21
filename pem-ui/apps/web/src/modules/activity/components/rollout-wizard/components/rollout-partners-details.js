import React, { useState } from 'react';
import { Grid, Column } from '@carbon/react';
import { RightArrow } from '../../../icons';

import RolloutPartnersWizard from './rollout-partners-wizard';
import RolloutPartnersPreview from './rollout-partners-preview';

import './../../style.scss';

export default function RolloutPartnersDetails({ handleAddGroups, handleAddAttributes, handleAddPartners, rolloutPartnersData, handleRemovePartners }) {
  const [showPreview, setShowPreview] = useState(true);
  const [selectedViewData, setSelectedViewData] = useState(null);
  const [selectedViewType, setSelectedViewType] = useState(null);

  const handleDetailsViewClick = (viewData, viewType) => {
    setSelectedViewData(viewData);
    setSelectedViewType(viewType);
    setShowPreview(false)
  };

  const handleOnClose = () => {
    setShowPreview(true)
  }

  return (
    <Grid className="partners-details-view-container">
      <Column lg={8} className="partners-details-list">
        <RolloutPartnersWizard
          rolloutPartnersData={rolloutPartnersData}
          handleAddGroups={handleAddGroups}
          handleAddAttributes={handleAddAttributes}
          handleAddPartners={handleAddPartners}
          handleDetailsViewClick={handleDetailsViewClick}
        />
      </Column>
      <Column lg={1} className="right-arrow-container">
        <RightArrow />
      </Column>
      <Column lg={7} className="partners-details-view">
        <RolloutPartnersPreview onClose={handleOnClose} rolloutPartnersData={rolloutPartnersData} showPreview={showPreview} selectedViewData={selectedViewData} selectedViewType={selectedViewType} handleRemovePartners={handleRemovePartners} />
      </Column>
    </Grid>
  );
}

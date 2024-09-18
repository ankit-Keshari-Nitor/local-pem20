import React, { useState } from 'react';
import { Column, Grid } from '@carbon/react';

import ActivityTaskDefinition from '../activity-task-definition';
import { CrossIcon, ExpandIcon, CollapseIcon } from './../../icons';
import ActivityVersions from './activity-versions-dropdown';
import './../block-properties-tray/block-properties-tray.scss';

export default function ActivityDefinitionForm(props) {
  const { readOnly, versionData = [], setShowActivityDefineDrawer, onActivityDetailsSave, activityOperation, activityDefinitionData, onExpand, setNotificationProps } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const onExpansionIconClick = (isExpanded) => {
    setIsExpanded(isExpanded);
    onExpand(isExpanded);
  };

  const onSubmitDefinitionForm = (values) => {
    const definition = {
      definationKey: '',
      name: values.name,
      description: values.description,
      contextData: values.contextData,
      encrypted: values.encrypted
    };
    const version = {
      encrypted: values.encrypted ? values.encrypted : false,
      contextData: values.contextData,
      status: 'Draft',
      number: 1,
      key: ''
    };
    onActivityDetailsSave({ definition, version });
    setNotificationProps({
      open: true,
      title: 'Success',
      subtitle: `${values.name} details saved successfully!`,
      kind: 'success',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    setShowActivityDefineDrawer(false);
  };

  return (
    <div className="block-properties-container">
      <div className="title-bar">
        <div className="title">
          <Grid fullWidth>
            <Column lg={6} md={3} sm={2}>
              <b>Define Activity</b>
            </Column>
            <Column lg={4} md={2} sm={1} className="activity-active">
              {activityDefinitionData.version.status}
            </Column>
            <Column lg={6} md={3} sm={2} className="activity-version-dropdown">
              {versionData.length > 0 && <ActivityVersions {...props} />}
            </Column>
          </Grid>
        </div>
        <div className="icon">
          <span className="icon" onClick={() => onExpansionIconClick(!isExpanded)}>
            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
          </span>
          <span onClick={() => setShowActivityDefineDrawer(false)} className="icon" style={{ marginLeft: '1rem' }}>
            <CrossIcon />
          </span>
        </div>
      </div>
      <ActivityTaskDefinition
        id={'activity-drawer'}
        onSubmitDefinitionForm={onSubmitDefinitionForm}
        activityOperation={activityOperation}
        activityDefinitionData={activityDefinitionData}
        readOnly={readOnly}
        setShowActivityDefineDrawer={setShowActivityDefineDrawer}
        setNotificationProps={setNotificationProps}
      />
    </div>
  );
}

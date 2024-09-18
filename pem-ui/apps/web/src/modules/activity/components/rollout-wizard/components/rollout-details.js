import React, { useState } from 'react';
import { Information } from '@carbon/icons-react';
import { Grid, Column, TextArea, TextInput, DatePicker, DatePickerInput, Button, Tooltip, RadioButtonGroup, RadioButton, Tag } from '@carbon/react';

import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';

import './../../style.scss';
import { EllipsisIcon } from '../../../icons';
import { capitalizeFirstLetter } from '../../../constants';

export default function RolloutDetails(props) {
  const pageUtil = Shell.PageUtil();
  const { rolloutDetails, setRolloutDetails, handleAddClick, formErrors, rolloutPartnersData, handleRemovePartners, onContextMapping } = props;
  const rolloutPartnersDataLength =
    rolloutPartnersData.selectedGroupsData.length + rolloutPartnersData.selectedAttributesData.length + rolloutPartnersData.selectedPartnersData.length;
  const [showContextData, setShowContextData] = useState(false);
  const [contextData, setContextData] = useState('');
  const [showCode, setShowCode] = useState(false);

  const getMinDate = (daysToAdd = 0, alertDate) => {
    const date = alertDate ? new Date(alertDate) : new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US');
  };

  const handleContextMapping = () => {
    if (onContextMapping) onContextMapping(true); // Call the passed function
    pageUtil.showPageModal('CONTEXT_DATA_MAPPING.VIEW').then((modalData) => {
      setContextData(JSON.stringify(modalData.data?.data));
      if (onContextMapping) onContextMapping(false); // Call the passed function
    });
  };

  const showCodeHandle = () => {
    setShowCode((prev) => !prev);
  };
  return (
    <>
      <Grid className="define-grid">
        {/* Name */}
        <Column className="col-margin" lg={12}>
          <TextInput
            id="name"
            required
            pattern="/^[^&<>'.{}]+$/i"
            data-testid="name"
            labelText="Name (required)"
            placeholder={'Enter Name'}
            invalidText={'Name is a required field.'}
            invalid={formErrors.name}
            value={rolloutDetails.name}
            onChange={(e) => setRolloutDetails((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Column>
        {/* Description */}
        <Column className="col-margin" lg={12}>
          <TextArea
            id="description"
            data-testid="description"
            labelText="Description"
            rows={3}
            enableCounter={true}
            counterMode="character"
            maxCount={100}
            minLength={0}
            rules={{ required: false, minLength: 0, maxLength: 100 }}
            invalidText={'Description must be at least 0 characters long.'}
            invalid={formErrors.description}
            value={rolloutDetails.description}
            placeholder={'Enter Description'}
            onChange={(e) => setRolloutDetails((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Column>
        {/*   Click to check Context Data Button */}
        <Column className="col-margin" lg={16}>
          <Button kind="tertiary" size="md" onClick={() => setShowContextData((prev) => !prev)}>
            {showContextData ? 'Hide Context Data' : 'View Context Data'}
          </Button>
        </Column>
        {/*   Context Data Code */}
        {showContextData && (
          <>
            <Column className="col-margin" lg={11}>
              {contextData && Object.keys(JSON.parse(contextData)).length !== 0 ? (
                <div className="context-data-view">
                  <div className="show-code-container">
                    <span className="show-code-title" onClick={showCodeHandle}>
                      {showCode ? 'Show Code' : 'Hide Code'}
                    </span>
                  </div>
                  <div className="context-data-code-container">
                    <span className="context-data-code" style={{ overflowX: showCode ? 'hidden' : 'scroll' }}>
                      {contextData}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="context-data-view">No Context Data</div>
              )}
            </Column>
            <Column lg={1}>
              <Button kind="secondary" className="context-selection-icon" renderIcon={EllipsisIcon} onClick={handleContextMapping}></Button>
            </Column>
          </>
        )}
        <Column className="col-margin" lg={16}></Column>
        {/*  Due Date */}
        <Column className="col-margin" lg={4}>
          <DatePicker
            datePickerType="single"
            minDate={getMinDate(0)}
            value={new Date(rolloutDetails.dueDate).toLocaleDateString('en-US')}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                dueDate: e
              }))
            }
          >
            <DatePickerInput
              placeholder="mm/dd/yyyy"
              labelText={
                <>
                  Due Date&nbsp;
                  <Tooltip align="right" label="Due date cannot be earlier than today.">
                    <Information />
                  </Tooltip>
                </>
              }
              id="due-date"
              size="md"
            />
          </DatePicker>
        </Column>
        {/*  Alert Date */}
        <Column className="col-margin" lg={4}>
          <DatePicker
            datePickerType="single"
            value={new Date(rolloutDetails.alertDate).toLocaleDateString('en-US')}
            minDate={getMinDate(1, rolloutDetails.dueDate)}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                alertDate: e
              }))
            }
          >
            <DatePickerInput
              id="alert_date"
              data-testid="alert-date"
              labelText={
                <>
                  Alert Date&nbsp;
                  <Tooltip
                    align="right"
                    label="Alert date cannot be today or earlier than today. Cannot be same or later than due date. Email alert notifications are sent to partners."
                  >
                    <Information />
                  </Tooltip>
                </>
              }
              placeholder="mm/dd/yyyy"
              size="md"
            />
          </DatePicker>
        </Column>
        {/*   Alert Interval */}
        <Column className="col-margin" lg={4}>
          <TextInput
            id="alert_interval"
            data-testid="alert-interval"
            labelText={
              <>
                Alert Interval&nbsp;
                <Tooltip align="right" label="Specify the alert email frequency in days. Enter the alert interval value in the range 1 - 99 days.">
                  <Information />
                </Tooltip>
              </>
            }
            placeholder={'Enter days'}
            invalidText={'Alert interval days should be between 1 and 99.'}
            invalid={formErrors.alertInterval}
            value={rolloutDetails.alertInterval}
            onChange={(e) =>
              setRolloutDetails((prev) => ({
                ...prev,
                alertInterval: e.target.value
              }))
            }
          />
        </Column>
        {/*   Rolling out to */}
        <Column className="col-margin" lg={12}>
          <RadioButtonGroup
            legendText="Rolling out to"
            data-testid="rolling-out"
            name="rolling-out"
            onChange={(value) => {
              setRolloutDetails((prev) => ({ ...prev, rollingOutTo: value }));
            }}
            valueSelected={rolloutDetails.rollingOutTo}
            //value={rolloutDetails.rollingOutTo}
            //defaultChecked={true}
          >
            <RadioButton labelText="Partners" value="partners" id="partners" />
            <RadioButton labelText="Internal Users" value="internal_users" id="internal_users" />
          </RadioButtonGroup>
        </Column>
        {/*  Partner, Groups and Attributes */}
        {rolloutDetails.rollingOutTo === 'partners' && (
          <Column className="partners_rollout-container" lg={12}>
            {rolloutPartnersDataLength === 0 ? (
              <>
                <TextArea
                  id="partners_rollout"
                  data-testid="partners_rollout"
                  labelText="Partner, Groups and Attributes (required)"
                  invalidText={'None of the Trading Partners is selected.'}
                  invalid={formErrors.partnersDetails}
                  required
                  readOnly
                  placeholder={'Click on add button to Partners, Attributes and Groups '}
                  rows={3}
                />
              </>
            ) : (
              <div className="partners_tags">
                {rolloutPartnersData.selectedPartnersData.length > 0 && (
                  <>
                    {rolloutPartnersData.selectedPartnersData.map((item) => {
                      return (
                        <Tag id={item.partnerKey} className="some-class" type="blue" filter onClose={() => handleRemovePartners([item.partnerUniqueId])} key={item.partnerUniqueId}>
                          {capitalizeFirstLetter(item.nameOfCompany)}
                        </Tag>
                      );
                    })}
                  </>
                )}
                {rolloutPartnersData.selectedAttributesData.length > 0 && (
                  <>
                    {rolloutPartnersData.selectedAttributesData.map((item) => {
                      return (
                        <Tag
                          id={item.attributeValueKey}
                          className="some-class"
                          type="blue"
                          filter
                          onClose={() => handleRemovePartners([item.attributeUniqueId])}
                          key={item.attributeUniqueId}
                        >
                          {item.attrValue}
                        </Tag>
                      );
                    })}
                  </>
                )}
                {rolloutPartnersData.selectedGroupsData.length > 0 && (
                  <>
                    {rolloutPartnersData.selectedGroupsData.map((item) => {
                      return (
                        <Tag id={item.value} className="some-class" type="blue" filter onClose={() => handleRemovePartners([item.groupUniqueId])} key={item.groupUniqueId}>
                          {item.value}
                        </Tag>
                      );
                    })}
                  </>
                )}
              </div>
            )}
            <Button className="add-button" kind="secondary" onClick={handleAddClick}>
              {rolloutPartnersDataLength === 0 ? 'Add' : 'Edit'}
            </Button>
          </Column>
        )}
      </Grid>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Grid, Column, TextInput, Checkbox, Button } from '@carbon/react';

import './../../style.scss';

export default function RolloutGroupTab({ rolloutPartnersData, handleAddGroups, handleDetailsViewClick }) {
  const [groupList, setGroupList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedGroups, setSelectedGroups] = React.useState([]);
  const [selectedGroupsData, setSelectedGroupsData] = React.useState([]);

  useEffect(() => {
    // TODO
    setGroupList([]);
  }, []);

  const handleCheck = (item) => {
    if (!selectedGroups.includes(item.key)) {
      setSelectedGroups([...selectedGroups, item.key]);
      setSelectedGroupsData([...selectedGroupsData, item]);
    } else {
      setSelectedGroups(selectedGroups.filter((e) => e !== item.key));
      setSelectedGroupsData(selectedGroupsData.filter((e) => e.key !== item.key));
    }
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedGroups([]);
      setSelectedGroupsData([]);
      setIsChecked(false);
    } else {
      const keys = groupList.map((e) => e.key);
      setSelectedGroups([...keys]);
      setSelectedGroupsData([...groupList]);
      setIsChecked(true);
    }
  };

  return (
    <Grid className="define-grid">
      {groupList.length === 0 ? (
        <Column className="col-margin" lg={16}>
          <p id={`attribute-list-label`} className="no-data-display-text">
            No Data to Display
          </p>
        </Column>
      ) : (
        <>
          <Column className="col-margin" lg={16}>
            <TextInput id={`group-search`} type="text" placeholder="Search by group name" />
          </Column>
          <Column className="select-all-checkbox" lg={8}>
            <Checkbox id="select_all" labelText="select_all" checked={isChecked} onChange={handleSelectAll} />
          </Column>
          {selectedGroups.length > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" onClick={() => handleAddGroups(selectedGroupsData)}>
                Add
              </Button>
            </Column>
          )}
          {groupList &&
            groupList.map((item) => {
              return (
                <Column className="col-margin" lg={16}>
                  <Checkbox
                    id={item.key}
                    labelText={item.value}
                    checked={selectedGroups.includes(item.key)}
                    onChange={() => handleCheck(item)}
                    className="partners-data-item"
                    onClick={() => handleDetailsViewClick(item, 'group')}
                  />
                </Column>
              );
            })}
        </>
      )}
    </Grid>
  );
}

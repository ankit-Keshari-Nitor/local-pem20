import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Column, Checkbox, Select, SelectItem, Button, Search } from '@carbon/react';
import * as RolloutService from '../../../services/rollout-service';
import { Add } from '@carbon/icons-react';
import './../../style.scss';
import { capitalizeFirstLetter } from '../../../constants';

export default function RolloutPartnerTab({ rolloutPartnersData, handleAddPartners, handleDetailsViewClick }) {
  const [selectedPartnerType, setSelectedPartnerType] = useState('company-id');
  const [partnerList, setPartnerList] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState(new Set()); // Using Set for unique partner IDs
  const [selectedPartnersData, setSelectedPartnersData] = useState([]);

  // Function to get the partners list
  const getTradingPartnerList = useCallback(() => {
    let param = {};
    if (selectedPartnerType === 'user-id' && searchKey !== '') {
      param = { userId: `con:${searchKey}` };
    } else if (selectedPartnerType === 'company-id' && searchKey !== '') {
      param = { searchText: searchKey };
    }

    RolloutService.getPartnerList(param)
      .then((response) => {
        setPartnerList([...response]);
      })
      .catch((errors) => {
        console.error('Failed to fetch data:', errors);
      });
  }, [selectedPartnerType, searchKey]);

  useEffect(() => {
    getTradingPartnerList();
  }, [getTradingPartnerList]);

  useEffect(() => {
    const partnerUniqueIds = new Set(rolloutPartnersData.selectedPartnersData.map((item) => item.partnerUniqueId));
    setSelectedPartners(partnerUniqueIds);
    setIsChecked(partnerUniqueIds.size === partnerList.length && partnerList.length > 0);
  }, [partnerList, rolloutPartnersData]);

  const handleOnChangeType = (e) => {
    setSelectedPartnerType(e.target.value);
  };

  const handleCheck = (item) => {
    const updatedSelectedPartners = new Set(selectedPartners);

    if (updatedSelectedPartners.has(item.partnerUniqueId)) {
      updatedSelectedPartners.delete(item.partnerUniqueId);
    } else {
      updatedSelectedPartners.add(item.partnerUniqueId);
    }
    setSelectedPartners(updatedSelectedPartners);
    setSelectedPartnersData(Array.from(updatedSelectedPartners).map((id) => partnerList.find((partner) => partner.partnerUniqueId === id)));

    setIsChecked(updatedSelectedPartners.size === partnerList.length);
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedPartners(new Set());
      setSelectedPartnersData([]);
      setIsChecked(false);
    } else {
      const updatedSelectedPartners = new Set(partnerList.map((e) => e.partnerUniqueId));
      setSelectedPartners(updatedSelectedPartners);
      setSelectedPartnersData(partnerList);
      setIsChecked(true);
    }
  };

  const filteredPartnerList = partnerList.filter(
    (item) => !rolloutPartnersData?.selectedPartnersData.some((selectedItem) => selectedItem.partnerUniqueId === item.partnerUniqueId)
  );

  return (
    <Grid className="define-grid-partner">
      {/* Search Box */}
      <Column className="col-margin" lg={8}>
        <Search
          size="lg"
          placeholder="Search by partner"
          labelText=""
          closeButtonLabelText="Clear search input"
          id={`trading-partners-search`}
          onChange={(event) => setSearchKey(event.target.value)}
          onKeyDown={(event) => setSearchKey(event.target.value)}
          value={searchKey}
        />
      </Column>
      {/* Filter Dropdown */}
      <Column className="col-margin" lg={8}>
        <Select id={`trading-partners-select`} labelText="" onChange={handleOnChangeType}>
          <SelectItem value="company-id" text="Company/Unique ID" />
          <SelectItem value="user-id" text="User ID (Email)" />
        </Select>
      </Column>
      {/* No Data to Display Text */}
      {partnerList.length === 0 || filteredPartnerList.length === 0 ? (
        <Column className="col-margin" lg={16}>
          <p id={`attribute-list-label`} className="no-data-display-text">
            No Data to Display
          </p>
        </Column>
      ) : (
        <>
          {/*Select Add */}
          <Column className="select-all-checkbox" lg={8}>
            <Checkbox id="select_all-partners" labelText="Select All" checked={isChecked} onChange={handleSelectAll} />
          </Column>
          {/* Add Button */}
          {selectedPartners.size > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" className="new-button" renderIcon={Add} onClick={() => handleAddPartners(Array.from(selectedPartnersData))}>
                Add
              </Button>
            </Column>
          )}
          {/*List of Partners */}
          {filteredPartnerList.map((item) => {
            return (
              <Column className="col-margin" lg={16} key={item.partnerUniqueId}>
                <div className="partners-data-item">
                  <Checkbox
                    id={item.partnerUniqueId}
                    labelText=""
                    checked={selectedPartners.has(item.partnerUniqueId)}
                    onChange={() => handleCheck(item)}
                    className="checkbox-input"
                  />
                  <span
                    className="partner-checkbox-label"
                    onClick={() => {
                      handleDetailsViewClick(item, 'partner');
                    }}
                  >
                    {capitalizeFirstLetter(item.nameOfCompany)}
                  </span>
                </div>
              </Column>
            );
          })}
        </>
      )}
    </Grid>
  );
}

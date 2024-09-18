import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Column, Checkbox, Select, SelectItem, Button, Search } from '@carbon/react';
import * as RolloutService from '../../../services/rollout-service';
import './../../style.scss';

export default function RolloutAttributeTab({ rolloutPartnersData, handleAddAttributes, handleDetailsViewClick }) {
  const [attributeTypeList, setAttributeTypeList] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState('');
  const [attributeList, setAttributeList] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = React.useState([]);
  const [selectedAttributesData, setSelectedAttributesData] = React.useState([]);

  // Function to get the attributes list
  const getAttributeListData = useCallback(() => {
    if (selectedAttributeType === '') {
      setAttributeList([]);
      return;
    }
    RolloutService.getAttributeList(selectedAttributeType, searchKey)
      .then((response) => {
        setAttributeList([...response]);
      })
      .catch((errors) => {
        console.error('Failed to fetch data:', errors);
      });
  }, [selectedAttributeType, searchKey]);

  // Function to get the attributes types
  const getAttributeTypes = useCallback(() => {
    RolloutService.getAttributeTypeList()
      .then((response) => {
        setAttributeTypeList(response);
      })
      .catch((errors) => {
        console.error('Failed to fetch data:', errors);
      });
  }, []);

  useEffect(() => {
    getAttributeListData();
  }, [searchKey, getAttributeListData]);

  useEffect(() => {
    getAttributeTypes();
  }, [getAttributeTypes]);

  useEffect(() => {
    if (rolloutPartnersData.selectedAttributesData.length > 0) {
      const attributeValueKeys = rolloutPartnersData.selectedAttributesData.map((item) => item.attributeValueKey);
      if (attributeList.length === attributeValueKeys.length && attributeValueKeys.length > 0) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
      setSelectedAttributes([...attributeValueKeys]);
    }
  }, [attributeList, rolloutPartnersData]);

  // Function to handle the selected attribute type input field
  const handleOnChangeType = (e) => {
    setSelectedAttributeType(e.target.value);
  };

  const handleCheck = (item) => {
    if (!selectedAttributes.includes(item.attributeValueKey)) {
      setSelectedAttributes([...selectedAttributes, item.attributeValueKey]);
      setSelectedAttributesData([...selectedAttributesData, item]);
    } else {
      setSelectedAttributes(selectedAttributes.filter((e) => e !== item.attributeValueKey));
      setSelectedAttributesData(selectedAttributesData.filter((e) => e.attributeValueKey !== item.attributeValueKey));
    }
  };

  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedAttributes([]);
      setSelectedAttributesData([]);
      setIsChecked(false);
    } else {
      const keys = attributeList.map((e) => e.attributeValueKey);
      setSelectedAttributes([...keys]);
      setSelectedAttributesData([...attributeList]);
      setIsChecked(true);
    }
  };

  return (
    <Grid className="define-grid">
      {/* Search Box */}
      <Column className="col-margin" lg={8}>
        <Search
          size="lg"
          placeholder="Select by Attribute value"
          labelText=""
          closeButtonLabelText="Clear search input"
          id={`attribute-search`}
          onChange={(event) => setSearchKey(event.target.value)}
          onKeyDown={(event) => setSearchKey(event.target.value)}
          value={searchKey}
        />
      </Column>
      {/* Filter Dropdown */}
      <Column className="col-margin" lg={8}>
        <Select id={`attribute-select`} labelText="" onChange={handleOnChangeType}>
          <SelectItem value={''} text={'Select Attribute Type'} />
          {attributeTypeList?.map((attributeType) => {
            return <SelectItem id={`attribute-select-item${attributeType?.attributeTypeKey}`} value={attributeType?.attributeTypeKey} text={attributeType?.name} />;
          })}
        </Select>
      </Column>
      {/* No Data to Display Text */}
      {attributeList && attributeList.length === 0 ? (
        <Column className="col-margin" lg={16}>
          <p id={`attribute-list-label`} className="no-data-display-text">
            No Data to Display
          </p>
        </Column>
      ) : (
        <>
          {/*Select Add */}
          <Column className="select-all-checkbox" lg={8}>
            <Checkbox id="select_all-attribute" labelText="Select All" checked={isChecked} onChange={handleSelectAll} />
          </Column>
          {/* Add Button */}
          {attributeList && selectedAttributes.length > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" onClick={() => handleAddAttributes(selectedAttributesData)}>
                Add
              </Button>
            </Column>
          )}
          {/*List of Attributes */}
          {attributeList &&
            attributeList.map((item) => {
              return (
                <Column className="col-margin" lg={16}>
                  <Checkbox
                    id={item.attributeValueKey}
                    labelText={item?.attrValue}
                    checked={selectedAttributes.includes(item.attributeValueKey)}
                    onChange={() => handleCheck(item)}
                    className="partners-data-item"
                    onClick={() => handleDetailsViewClick(item, 'attribute')}
                  />
                </Column>
              );
            })}
        </>
      )}
    </Grid>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Search,
  Select,
  SelectItem,
  Checkbox,
  Accordion,
  AccordionItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  RadioButtonGroup,
  RadioButton
} from '@carbon/react';

import * as RolloutService from '../../../services/rollout-service';

import './../../style.scss';

import { CrossIcon } from '../../../icons';
import { TrashCan } from '@carbon/icons-react';
import { capitalizeFirstLetter } from '../../../constants';

export default function RolloutPartnersPreview({ rolloutPartnersData, onClose, showPreview, selectedViewData, selectedViewType, handleRemovePartners }) {
  const [searchKey, setSearchKey] = useState('');
  const [selectFilter, setSelectFilter] = useState('all');

  const [isChecked, setIsChecked] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [selectedPartnersData, setSelectedPartnersData] = useState([]);

  const [partnerUserList, setPartnerUserList] = useState([]);
  const [selectedPartnerUser, setSelectedPartnerUser] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Determine if rollout data is available
  const isRolloutDataAvl = rolloutPartnersData?.selectedPartnersData.length + rolloutPartnersData?.selectedAttributesData.length + rolloutPartnersData?.selectedGroupsData.length;

  // Effect to reset tab index and clear partner user list when selectedViewData changes
  useEffect(() => {
    setSelectedTabIndex(0);
    setPartnerUserList([]);
    setSelectedPartnerUser(null);
  }, [selectedViewData]);

  // Effect to set the first user as the selected partner user when the partner user list changes
  useEffect(() => {
    if (partnerUserList.length > 0) {
      setSelectedPartnerUser(partnerUserList[0]);
    }
  }, [partnerUserList]);

  // Effect to reset selected partners and checkboxes when rolloutPartnersData changes
  useEffect(() => {
    setSelectedPartners([])
    setSelectedPartnersData([]);
    setIsChecked(false);
  }, [rolloutPartnersData])

  // Handle checkbox selection for partners
  const handleCheck = (item) => {
    let updatedSelectedPartners;
    let updatedSelectedPartnersData;

    if (!selectedPartners.includes(item.partnerUniqueId)) {
      updatedSelectedPartners = [...selectedPartners, item.partnerUniqueId];
      updatedSelectedPartnersData = [...selectedPartnersData, item];
    } else {
      updatedSelectedPartners = selectedPartners.filter((e) => e !== item.partnerUniqueId);
      updatedSelectedPartnersData = selectedPartnersData.filter((e) => e.partnerUniqueId !== item.partnerUniqueId);
    }

    setSelectedPartners(updatedSelectedPartners);
    setSelectedPartnersData(updatedSelectedPartnersData);

    // Update the "Select All" checkbox state
    setIsChecked(updatedSelectedPartners.length === rolloutPartnersData?.selectedPartnersData.length);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (isChecked) {
      setSelectedPartners([]);
      setSelectedPartnersData([]);
      setIsChecked(false);
    } else {
      const keys = rolloutPartnersData?.selectedPartnersData.map((e) => e.partnerUniqueId);
      setSelectedPartners([...keys]);
      setSelectedPartnersData([...rolloutPartnersData?.selectedPartnersData]);
      setIsChecked(true);
    }
  };

  // Fetch partner user list based on role and partner ID
  const getPartnerUserList = async (participantRole, partnerId) => {
    let param = {};
    participantRole !== '' ? (param.participantRole = participantRole) : (param = {});
    const response = await RolloutService.getPartnerUserList(param, partnerId);
    setPartnerUserList(response);
  };

  // Handle radio button change
  const handleRadioChange = (value) => {
    const partner = partnerUserList.find((item) => item.userName === value);
    setSelectedPartnerUser(partner);
  };

  const handleTabChange = async (index) => {
    setSelectedTabIndex(index.selectedIndex);
    setPartnerUserList([]);
    setSelectedPartnerUser(null);
    if (index.selectedIndex === 1) {
      // Fetch administrators data
      await getPartnerUserList('PARTNER_ADMIN', selectedViewData.partnerKey);
    } else if (index.selectedIndex === 2) {
      // Fetch users data
      await getPartnerUserList('', selectedViewData.partnerKey);
    }
  };

  return (
    <>
      {showPreview ? (
        <Grid className="define-grid">
          <Column className="col-margin" lg={16}>
            <p id={`preview-group-list-label`} className="rollout-list-text">
              Preview
            </p>
          </Column>
          <Column className="col-margin" lg={8}>
            <Search
              size="lg"
              placeholder="Search selection"
              labelText=""
              closeButtonLabelText="Clear search input"
              id={`preview-search-selection`}
              onChange={(event) => setSearchKey(event.target.value)}
              onKeyDown={(event) => setSearchKey(event.target.value)}
              value={searchKey}
            />
          </Column>

          <Column className="col-margin" lg={8}>
            <Select id={`preview-select-filter`} labelText="" onChange={(e) => setSelectFilter(e.target.value)} value={selectFilter}>
              <SelectItem value="all" text="All" />
              <SelectItem value="partners" text="Partners" />
              <SelectItem value="attributes" text="Attributes" />
              <SelectItem value="group" text="Groups" />
            </Select>
          </Column>
          {isRolloutDataAvl > 0 && (
            <Column className="select-all-checkbox" lg={8}>
              <Checkbox id="preview-select_all-partners" labelText="Select All" onChange={handleSelectAll} checked={isChecked} />
            </Column>
          )}
          {isRolloutDataAvl > 0 && (
            <Column className="col-margin" lg={8}>
              <Button size="sm" className="new-button" renderIcon={TrashCan} onClick={() => handleRemovePartners(selectedPartners)}>
                Delete
              </Button>
            </Column>
          )}
          {rolloutPartnersData?.selectedPartnersData.length > 0 && (
            <>
              <Column className="col-margin" lg={16}>
                <p id={`preview-group-list-label`} className="rollout-list-text">
                  Partners
                </p>
              </Column>
              {rolloutPartnersData?.selectedPartnersData
                .filter((item, index, self) =>
                  index === self.findIndex(t => t.partnerUniqueId === item.partnerUniqueId)
                )
                .map((item) => (
                  <Column className="col-margin" lg={16} key={item.partnerUniqueId}>
                    <Checkbox
                      id={`preview-${item.partnerUniqueId}`}
                      labelText={capitalizeFirstLetter(item.nameOfCompany)}
                      checked={selectedPartners.includes(item.partnerUniqueId)}
                      onChange={() => handleCheck(item)}
                    />
                  </Column>
                ))
              }
            </>
          )}
          {rolloutPartnersData?.selectedAttributesData.length > 0 && (
            <>
              <Column className="col-margin" lg={16}>
                <p id={`group-list-label`} className="rollout-list-text">
                  Attributes
                </p>
              </Column>
              {rolloutPartnersData?.selectedAttributesData.map((item) => (
                <Column className="col-margin" lg={16} key={item.attributeTypeKey}>
                  <Checkbox id={`preview-${item.attributeTypeKey}`} labelText={item.attrValue} />
                </Column>
              ))}
            </>
          )}
          {rolloutPartnersData?.selectedGroupsData.length > 0 && (
            <>
              <Column className="col-margin" lg={16}>
                <p id={`group-list-label`} className="rollout-list-text">
                  Group
                </p>
              </Column>
              {rolloutPartnersData?.selectedGroupsData.map((item) => (
                <Column className="col-margin" lg={16} key={item.key}>
                  <Checkbox id={`preview-${item.key}`} labelText={item.value} />
                </Column>
              ))}
            </>
          )}
        </Grid>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem' }}>
            <div style={{ fontWeight: '600', fontSize: '18px' }}>{selectedViewData?.nameOfCompany} Details</div>
            <div className="close-icon" aria-label="close" onClick={onClose}>
              <CrossIcon />
            </div>
          </div>
          <Tabs selectedIndex={selectedTabIndex} onChange={handleTabChange}>
            <TabList aria-label="List of tabs">
              <Tab>Organization</Tab>
              <Tab>Administrators</Tab>
              <Tab>Users</Tab>
            </TabList>
            <div className='partner-view-layout'>
              <TabPanels >
                <TabPanel>
                  <Accordion>
                    <AccordionItem title="Partner Organization Information">
                      <div style={{ marginLeft: '5rem' }}>
                        <div>
                          <strong>Partner Key</strong>
                        </div>
                        <div>{selectedViewData?.partnerKey ? selectedViewData?.partnerKey : 'None'}</div>
                        <div>
                          <strong>Partner Unique ID</strong>
                        </div>
                        <div>{selectedViewData?.partnerUniqueId ? selectedViewData?.partnerUniqueId : 'None'}</div>
                        <div>
                          <strong>Name of Company</strong>
                        </div>
                        <div>{selectedViewData?.nameOfCompany ? selectedViewData?.nameOfCompany : 'None'}</div>
                        <div>
                          <strong>Street address and PO Box </strong>
                        </div>
                        <div>{selectedViewData?.streetAddress ? selectedViewData?.streetAddress : 'None'}</div>
                        <div>
                          <strong>Zip / Postal Code</strong>
                        </div>
                        <div>{selectedViewData?.zipCode ? selectedViewData?.zipCode : 'None'}</div>
                        <div>
                          <strong>Headquaters Phone</strong>
                        </div>
                        <div>{selectedViewData?.headOfficePhone ? selectedViewData?.headOfficePhone : 'None'}</div>
                        <div>
                          <strong>Website</strong>
                        </div>
                        <div>{selectedViewData?.website ? selectedViewData?.website : 'None'}</div>
                        <div>
                          <strong>Invite Status</strong>
                        </div>
                        <div>{selectedViewData?.status?.display ? selectedViewData?.status?.display : 'None'}</div>
                      </div>
                    </AccordionItem>
                    <AccordionItem title="Account Information">
                      <div style={{ marginLeft: '5rem' }}>
                        <div>
                          <strong>User ID (Email)</strong>
                        </div>
                        <div>{selectedViewData?.userId ? selectedViewData?.userId : 'None'}</div>
                        <div>
                          <strong>Given name</strong>
                        </div>
                        <div>{selectedViewData?.firstName ? selectedViewData?.firstName : 'None'}</div>
                        <div>
                          <strong>Surname</strong>
                        </div>
                        <div>{selectedViewData?.lastName ? selectedViewData?.lastName : 'None'}</div>
                        <div>
                          <strong>Business role/Title </strong>
                        </div>
                        <div>{'None'}</div>
                        <div>
                          <strong>Alternate email</strong>
                        </div>
                        <div>{'None'}</div>
                        <div>
                          <strong>Phone (Office)</strong>
                        </div>
                        <div>{selectedViewData?.officePhone ? selectedViewData?.officePhone : 'None'}</div>
                        <div>
                          <strong>Phone (Mobile)</strong>
                        </div>
                        <div>{'None'}</div>
                        <div>
                          <strong>Other contact information</strong>
                        </div>
                        <div>{'None'}</div>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </TabPanel>
                <TabPanel>
                  <div className="details-container">
                    <div>
                      <div>
                        <div><strong>Given name</strong></div>
                        <div>{selectedPartnerUser?.firstName ? selectedPartnerUser.firstName : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Surname</strong></div>
                        <div>{selectedPartnerUser?.lastName ? selectedPartnerUser.lastName : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Business role/Title </strong>  </div>
                        <div>{selectedPartnerUser?.businessRole ? selectedPartnerUser.businessRole : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Alternate email</strong></div>
                        <div>{'None'}</div>
                      </div>
                      <div>
                        <div> <strong>Phone (Office)</strong> </div>
                        <div>{selectedPartnerUser?.officePhone ? selectedPartnerUser.officePhone : 'None'}</div>
                      </div>
                      <div>
                        <div> <strong>Phone (Mobile)</strong></div>
                        <div>{selectedPartnerUser?.mobilePhone ? selectedPartnerUser.mobilePhone : 'None'}</div>
                      </div>
                      <div>
                        <div>  <strong>Other contact info</strong>  </div>
                        <div>{selectedPartnerUser?.furtherContacts ? selectedPartnerUser.furtherContacts : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Comments</strong></div>
                        <div>{selectedPartnerUser?.comments ? selectedPartnerUser.comments : 'None'}</div>
                      </div>
                    </div>
                    <div>
                      <RadioButtonGroup valueSelected={selectedPartnerUser?.userName} name="partner-admin" orientation="vertical" onChange={handleRadioChange}>
                        {partnerUserList.length > 0 && partnerUserList.map((item, idx) => <RadioButton key={idx} labelText={item.userName} value={item.userName} />)}
                      </RadioButtonGroup>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="details-container">
                    <div>
                      <div>
                        <div><strong>Given name</strong></div>
                        <div>{selectedPartnerUser?.firstName ? selectedPartnerUser.firstName : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Surname</strong></div>
                        <div>{selectedPartnerUser?.lastName ? selectedPartnerUser.lastName : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Business role/Title </strong>  </div>
                        <div>{selectedPartnerUser?.businessRole ? selectedPartnerUser.businessRole : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Alternate email</strong></div>
                        <div>{'None'}</div>
                      </div>
                      <div>
                        <div> <strong>Phone (Office)</strong> </div>
                        <div>{selectedPartnerUser?.officePhone ? selectedPartnerUser.officePhone : 'None'}</div>
                      </div>
                      <div>
                        <div> <strong>Phone (Mobile)</strong></div>
                        <div>{selectedPartnerUser?.mobilePhone ? selectedPartnerUser.mobilePhone : 'None'}</div>
                      </div>
                      <div>
                        <div>  <strong>Other contact info</strong>  </div>
                        <div>{selectedPartnerUser?.furtherContacts ? selectedPartnerUser.furtherContacts : 'None'}</div>
                      </div>
                      <div>
                        <div><strong>Comments</strong></div>
                        <div>{selectedPartnerUser?.comments ? selectedPartnerUser.comments : 'None'}</div>
                      </div>
                    </div>
                    <div>
                      <RadioButtonGroup valueSelected={selectedPartnerUser?.userName} name="partner-user" orientation="vertical" onChange={handleRadioChange}>
                        {partnerUserList.length > 0 && partnerUserList.map((item, idx) => <RadioButton key={idx} labelText={item.userName} value={item.userName} />)}
                      </RadioButtonGroup>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </div>
          </Tabs>
        </>
      )}
    </>
  );
}

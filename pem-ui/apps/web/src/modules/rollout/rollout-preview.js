import React from 'react';
import { Grid, Column, Search, Select, SelectItem, Checkbox, Tabs, Tab, TabList, TabPanel, TabPanels, AccordionItem, Accordion, RadioButtonGroup, RadioButton, Button } from '@carbon/react'
import Shell from '@b2bi/shell';

import { TrashCan } from '@carbon/icons-react';
import { CrossIcon } from './icons';

const RolloutPreview = ({ previewPage, wizardPage }) => {
    const pageUtil = Shell.PageUtil();
    const pageArgs = pageUtil.pageParams;

    // Determine if rollout data is available
    const isRolloutDataAvl = wizardPage.page.ui.partnersData.length + wizardPage.page.ui.attributesData.length + wizardPage.page.ui.groupsData.length;


    const { page } = Shell.usePage(
        [],
        (function Page(pageArgs, pageUtil) {
            return {
                ui: {
                    searchKey: '',
                    selectedFilter: 'all',
                    selectedPartnerUser: null,
                    partnerUserList: [],
                    selectedPartners: [],
                    selectedPartnersData: [],
                    isChecked: false,
                    filteredPartners: [],
                    filteredAttributes: [],
                    filteredGroups: [],
                    noDataMessage: false,
                },

                datasources: {
                    getPartnerUserList: {
                        dataloader: 'ROLLOUT.PARTNER_USER',
                    },
                },
                observers: [
                    {
                        observers: function () {
                            return [wizardPage.page.ui.partnersData]
                        }, handler: function () {
                            this.setUI('selectedPartners', []);
                            this.setUI('selectedPartnersData', []);
                            this.setUI('isChecked', false);
                            this.setUI('searchKey', '');
                            this.setUI('filteredPartners', []);
                        }
                    },
                    {
                        observers: function () {
                            return [this.ui.searchKey, this.ui.selectedFilter];
                        },
                        handler: function () {
                            const filteredPartners = wizardPage.page.ui.partnersData.filter(partner => {
                                const matchesSearch = partner.nameOfCompany.toLowerCase().includes(this.ui.searchKey.toLowerCase());
                                return (this.ui.selectedFilter === 'all' || this.ui.selectedFilter === 'partners')
                                    ? (this.ui.searchKey === '' || matchesSearch)
                                    : true;
                            });
                            this.setUI('filteredPartners', filteredPartners);

                            // Set the no data message
                            this.setUI('noDataMessage', (this.ui.selectedFilter === 'all' || this.ui.selectedFilter === 'partners') &&
                                filteredPartners.length === 0 && this.ui.searchKey.length > 0);
                        }
                    }
                ],
                init: function () { wizardPage.page.setUI('errorPreview', undefined); },
                uiHandleTabChange: function (...args) {
                    previewPage.setUI('selectedTabIndex', args[0].selectedIndex);
                    this.setUI('partnerUserList', []);
                    this.setUI('selectedPartnerUser', null);
                    if (args[0].selectedIndex === 1) {
                        let handler;
                        let params = {
                            participantRole: 'PARTNER_ADMIN'
                        }
                        handler = this.ds.getPartnerUserList({ partnerKey: previewPage.ui.selectedViewData?.partnerKey }, { params });
                        handler &&
                            handler
                                .then((response) => {
                                    this.setUI('selectedPartnerUser', response.data[0]);
                                    this.setUI('partnerUserList', response.data)
                                }).catch((err) => { });
                    } else if (args[0].selectedIndex === 2) {
                        let handler;
                        let params = {}
                        handler = this.ds.getPartnerUserList({ partnerKey: previewPage.ui.selectedViewData?.partnerKey }, { params });
                        handler &&
                            handler
                                .then((response) => {
                                    this.setUI('selectedPartnerUser', response.data[0]);
                                    this.setUI('partnerUserList', response.data);
                                }).catch((err) => { });
                    }
                },
                uiHandleRadioChange: function (value) {
                    const partner = this.ui.partnerUserList.find((item) => item.userName === value);
                    this.setUI('selectedPartnerUser', partner);
                },
                uiOnHandleCheck: function (item) {
                    wizardPage.page.setUI('errorWizard', undefined);
                    let updatedSelectedPartners;
                    let updatedSelectedPartnersData;

                    if (!page.ui.selectedPartners.includes(item.partnerUniqueId)) {
                        updatedSelectedPartners = [...page.ui.selectedPartners, item.partnerUniqueId];
                        updatedSelectedPartnersData = [...page.ui.selectedPartnersData, item];
                    } else {
                        updatedSelectedPartners = page.ui.selectedPartners.filter((e) => e !== item.partnerUniqueId);
                        updatedSelectedPartnersData = page.ui.selectedPartnersData.filter((e) => e.partnerUniqueId !== item.partnerUniqueId);
                    }

                    this.setUI('selectedPartners', updatedSelectedPartners);
                    this.setUI('selectedPartnersData', updatedSelectedPartnersData);
                    this.setUI('isChecked', updatedSelectedPartners.length === wizardPage.page.ui.partnersData.length);
                },
                uiOnHandleSelectAll: function () {
                    wizardPage.page.setUI('errorWizard', undefined);
                    if (this.ui.isChecked) {
                        this.setUI('selectedPartners', []);
                        this.setUI('selectedPartnersData', []);
                        this.setUI('isChecked', false);
                    } else {
                        const keys = wizardPage.page.ui.partnersData.map((e) => e.partnerUniqueId);
                        this.setUI('selectedPartners', [...keys]);
                        this.setUI('selectedPartnersData', [...wizardPage.page.ui.partnersData]);
                        this.setUI('isChecked', true);
                    }
                },
                uiHandleFilterChange: function (event) {
                    this.setUI('selectedFilter', event.target.value);
                },
            };
        })(pageArgs, pageUtil)
    );


    return (
        <>
            {previewPage.ui.showPreview ? (
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
                            onChange={(event) => page.setUI('searchKey', event.target.value)}
                            onKeyDown={(event) => page.setUI('searchKey', event.target.value)}
                            value={page.ui.searchKey}
                        />
                    </Column>

                    <Column className="col-margin" lg={8} onChange={page.uiHandleFilterChange} value={page.ui.selectedFilter}>
                        <Select id={`preview-select-filter`} labelText="" >
                            <SelectItem value="all" text="All" />
                            <SelectItem value="partners" text="Partners" />
                            <SelectItem value="attributes" text="Attributes" />
                            <SelectItem value="group" text="Groups" />
                        </Select>
                    </Column>

                    {isRolloutDataAvl > 0 && (
                        <Column className="select-all-checkbox" lg={8}>
                            <Checkbox id="preview-select_all-partners" labelText="Select All" onChange={page.uiOnHandleSelectAll} checked={page.ui.isChecked} />
                        </Column>
                    )}
                    {isRolloutDataAvl > 0 && (
                        <Column className="col-margin" lg={8}>
                            <Button size="sm" className="new-button" renderIcon={TrashCan} onClick={() => wizardPage.page.uiOnHandleRemove('Partner', page.ui.selectedPartners)} >
                                Delete
                            </Button>
                        </Column>
                    )}
                    {page.ui.noDataMessage ? (
                        <Column className="col-margin" lg={16}>
                            <p className="no-data-message">No Data Display</p>
                        </Column>
                    ) : (
                        <>  <Column lg={16}>  {wizardPage.page.ui.errorPreview !== undefined && (<span className='errorMessage'>{wizardPage.page.ui.errorPreview}</span>)}</Column>
                            {wizardPage.page.ui.partnersData.length > 0 && (page.ui.selectedFilter === "partners" || page.ui.selectedFilter === 'all') && (
                                <>
                                    <Column className="col-margin" lg={16}>
                                        <p id={`preview-partner-list-label`} className="rollout-list-text">
                                            Partners
                                        </p>
                                    </Column>
                                    {(page.ui.filteredPartners.length > 0 ? page.ui.filteredPartners : wizardPage.page.ui.partnersData)
                                        .filter((item, index, self) =>
                                            index === self.findIndex(t => t.partnerUniqueId === item.partnerUniqueId)
                                        )
                                        .map((item) => (
                                            <Column className="col-margin" lg={16} key={item.partnerUniqueId}>
                                                <Checkbox
                                                    id={`preview-${item.partnerUniqueId}`}
                                                    labelText={wizardPage.page.uiCapitalizeFirstLetter(item.nameOfCompany)}
                                                    checked={page.ui.selectedPartners.includes(item.partnerUniqueId)}
                                                    onChange={() => page.uiOnHandleCheck(item)}
                                                />
                                            </Column>
                                        ))}
                                </>
                            )}
                            {wizardPage.page.ui.attributesData.length > 0 && (page.ui.selectedFilter === "attributes" || page.ui.selectedFilter === 'all') && (
                                <>
                                    <Column className="col-margin" lg={16}>
                                        <p id={`preview-attribute-list-label`} className="rollout-list-text">
                                            Attributes
                                        </p>
                                    </Column>
                                    {wizardPage.page.ui.attributesData.map((item) => (
                                        <Column className="col-margin" lg={16} key={item.attributeTypeKey}>
                                            <Checkbox
                                                id={`preview-${item.attributeTypeKey}`}
                                                labelText={wizardPage.page.uiCapitalizeFirstLetter(item.name)}
                                            />
                                        </Column>
                                    ))}
                                </>
                            )}
                            {wizardPage.page.ui.groupsData.length > 0 && (page.ui.selectedFilter === "groups" || page.ui.selectedFilter === 'all') && (
                                <>
                                    <Column className="col-margin" lg={16}>
                                        <p id={`preview-group-list-label`} className="rollout-list-text">
                                            Groups
                                        </p>
                                    </Column>
                                    {wizardPage.page.ui.groupsData.map((item) => (
                                        <Column className="col-margin" lg={16} key={item.key}>
                                            <Checkbox
                                                id={`preview-${item.key}`}
                                                labelText={wizardPage.page.uiCapitalizeFirstLetter(item.name)}
                                            />
                                        </Column>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </Grid >
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem' }}>
                        <div style={{ fontWeight: '600', fontSize: '18px' }}>{previewPage.ui?.selectedViewData?.nameOfCompany} Details</div>
                        <div className="close-icon" aria-label="close" onClick={previewPage.uiOnClose}>
                            <CrossIcon />
                        </div>
                    </div>
                    <Tabs selectedIndex={previewPage.ui.selectedTabIndex} onChange={page.uiHandleTabChange}>
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
                                                <div>{previewPage.ui?.selectedViewData?.partnerKey ? previewPage.ui.selectedViewData?.partnerKey : 'None'}</div>
                                                <div>
                                                    <strong>Partner Unique ID</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.partnerUniqueId ? previewPage.ui?.selectedViewData?.partnerUniqueId : 'None'}</div>
                                                <div>
                                                    <strong>Name of Company</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.nameOfCompany ? previewPage.ui?.selectedViewData?.nameOfCompany : 'None'}</div>
                                                <div>
                                                    <strong>Street address and PO Box </strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.streetAddress ? previewPage.ui?.selectedViewData?.streetAddress : 'None'}</div>
                                                <div>
                                                    <strong>Zip / Postal Code</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.zipCode ? previewPage.ui?.selectedViewData?.zipCode : 'None'}</div>
                                                <div>
                                                    <strong>Headquaters Phone</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.headOfficePhone ? previewPage.ui?.selectedViewData?.headOfficePhone : 'None'}</div>
                                                <div>
                                                    <strong>Website</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.website ? previewPage.ui?.selectedViewData?.website : 'None'}</div>
                                                <div>
                                                    <strong>Invite Status</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.status?.display ? previewPage.ui?.selectedViewData?.status?.display : 'None'}</div>
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem title="Account Information">
                                            <div style={{ marginLeft: '5rem' }}>
                                                <div>
                                                    <strong>User ID (Email)</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.userId ? previewPage.ui?.selectedViewData?.userId : 'None'}</div>
                                                <div>
                                                    <strong>Given name</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.firstName ? previewPage.ui?.selectedViewData?.firstName : 'None'}</div>
                                                <div>
                                                    <strong>Surname</strong>
                                                </div>
                                                <div>{previewPage.ui?.selectedViewData?.lastName ? previewPage.ui?.selectedViewData?.lastName : 'None'}</div>
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
                                                <div>{previewPage.ui?.selectedViewData?.officePhone ? previewPage.ui?.selectedViewData?.officePhone : 'None'}</div>
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
                                                <div>{page.ui.selectedPartnerUser?.firstName ? page.ui.selectedPartnerUser.firstName : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Surname</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.lastName ? page.ui.selectedPartnerUser.lastName : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Business role/Title </strong>  </div>
                                                <div>{page.ui.selectedPartnerUser?.businessRole ? page.ui.selectedPartnerUser.businessRole : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Alternate email</strong></div>
                                                <div>{'None'}</div>
                                            </div>
                                            <div>
                                                <div> <strong>Phone (Office)</strong> </div>
                                                <div>{page.ui.selectedPartnerUser?.officePhone ? page.ui.selectedPartnerUser.officePhone : 'None'}</div>
                                            </div>
                                            <div>
                                                <div> <strong>Phone (Mobile)</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.mobilePhone ? page.ui.selectedPartnerUser.mobilePhone : 'None'}</div>
                                            </div>
                                            <div>
                                                <div>  <strong>Other contact info</strong>  </div>
                                                <div>{page.ui.selectedPartnerUser?.furtherContacts ? page.ui.selectedPartnerUser.furtherContacts : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Comments</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.comments ? page.ui.selectedPartnerUser.comments : 'None'}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <RadioButtonGroup valueSelected={page.ui.selectedPartnerUser?.userName} name="partner-admin" orientation="vertical" onChange={(e) => { page.uiHandleRadioChange(e) }} >
                                                {page.ui.partnerUserList.length > 0 && page.ui.partnerUserList.map((item, idx) => <RadioButton key={idx} labelText={item.userName} value={item.userName} />)}
                                            </RadioButtonGroup>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="details-container">
                                        <div>
                                            <div>
                                                <div><strong>Given name</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.firstName ? page.ui.selectedPartnerUser.firstName : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Surname</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.lastName ? page.ui.selectedPartnerUser.lastName : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Business role/Title </strong>  </div>
                                                <div>{page.ui.selectedPartnerUser?.businessRole ? page.ui.selectedPartnerUser.businessRole : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Alternate email</strong></div>
                                                <div>{'None'}</div>
                                            </div>
                                            <div>
                                                <div> <strong>Phone (Office)</strong> </div>
                                                <div>{page.ui.selectedPartnerUser?.officePhone ? page.ui.selectedPartnerUser.officePhone : 'None'}</div>
                                            </div>
                                            <div>
                                                <div> <strong>Phone (Mobile)</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.mobilePhone ? page.ui.selectedPartnerUser.mobilePhone : 'None'}</div>
                                            </div>
                                            <div>
                                                <div>  <strong>Other contact info</strong>  </div>
                                                <div>{page.ui.selectedPartnerUser?.furtherContacts ? page.ui.selectedPartnerUser.furtherContacts : 'None'}</div>
                                            </div>
                                            <div>
                                                <div><strong>Comments</strong></div>
                                                <div>{page.ui.selectedPartnerUser?.comments ? page.ui.selectedPartnerUser.comments : 'None'}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <RadioButtonGroup valueSelected={page.ui.selectedPartnerUser?.userName} name="partner-user" orientation="vertical" onChange={page.uiHandleRadioChange} >
                                                {page.ui.partnerUserList.length > 0 && page.ui.partnerUserList.map((item, idx) => <RadioButton key={idx} labelText={item.userName} value={item.userName} />)}
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
};

export default RolloutPreview;
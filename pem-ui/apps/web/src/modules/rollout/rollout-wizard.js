import React from 'react';
import { Grid, Column, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Checkbox, Search, Select, SelectItem } from '@carbon/react';
import Shell from '@b2bi/shell';
import { RightArrow, GroupsTabIcon, PartnersTabIcon, AttributesTabIcon } from './icons';
import RolloutPreview from './rollout-preview';
import { Add } from '@carbon/icons-react';

const RolloutWizard = (wizardPage) => {
    const pageUtil = Shell.PageUtil();
    const pageArgs = pageUtil.pageParams;

    const { page } = Shell.usePage(
        [],
        (function Page(pageArgs, pageUtil) {
            return {

                ui: {
                    selectedPartners: new Set(),
                    selectedPartnersData: [],
                    partnerIsChecked: false,
                    searchKey: '',
                    selectedFilter: 'searchText',
                    showPreview: true,
                    selectedViewData: null,
                    selectedViewType: null,
                    selectedTabIndex: 0,

                },
                observers: [
                    {
                        observers: function () {
                            return [wizardPage.page.model.partnerList, wizardPage.page.ui.partnersData]
                        },
                        handler: function () {
                            const partnerUniqueIds = new Set(wizardPage.page.ui.partnersData.map((item) => item.partnerUniqueId));
                            this.setUI('selectedPartners', partnerUniqueIds);
                            this.setUI('partnerIsChecked', partnerUniqueIds.size === wizardPage.page.model.partnerList.length && wizardPage.page.model.partnerList.length > 0);
                        }
                    },

                ],
                init: function () {
                    wizardPage.page.setUI('errorWizard', undefined);
                    wizardPage.page.setUI('filterPartnerList', wizardPage.page.model.partnerList.filter(
                        (item) => !wizardPage.page.ui.partnersData.some((selectedItem) => selectedItem.partnerUniqueId === item.partnerUniqueId)
                    ))
                    if (wizardPage.page.ui.partnersData.length > 0) {
                        const partnerUniqueIds = new Set(wizardPage.page.ui.partnersData.map(partner => partner.partnerUniqueId));

                        this.setUI('selectedPartners', partnerUniqueIds);
                    }
                },
                uiOnSelectPartners: function (item) {
                    page.setUI('errorWizard', undefined);
                    const updatedSelectedPartners = new Set(this.ui.selectedPartners);

                    if (updatedSelectedPartners.has(item.partnerUniqueId)) {
                        updatedSelectedPartners.delete(item.partnerUniqueId);
                    } else {
                        updatedSelectedPartners.add(item.partnerUniqueId);
                    }
                    this.setUI('selectedPartners', updatedSelectedPartners);
                    this.setUI('selectedPartnersData', Array.from(updatedSelectedPartners).map((id) => wizardPage.page.model.partnerList.find((partner) => partner.partnerUniqueId === id)));

                    this.setUI('partnerIsChecked', updatedSelectedPartners.size === wizardPage.page.model.partnerList.length);
                },
                uiOnSelectAllPartners: function () {
                    page.setUI('errorWizard', undefined);
                    if (page.ui.partnerIsChecked) {
                        this.setUI('selectedPartners', new Set());
                        this.setUI('selectedPartnersData', []);
                        this.setUI('partnerIsChecked', false);
                    } else {
                        const updatedSelectedPartners = new Set(wizardPage.page.model.partnerList.map((e) => e.partnerUniqueId));
                        this.setUI('selectedPartners', updatedSelectedPartners);
                        this.setUI('selectedPartnersData', wizardPage.page.model.partnerList);
                        this.setUI('partnerIsChecked', true);
                    }

                },
                uiOnHandlePartnerChangeType: function (event) {
                    this.setUI('selectedFilter', event.target.value)
                },
                uiOnHandleDetailsViewClick: function (viewData, viewType) {
                    this.setUI('showPreview', false);
                    this.setUI('selectedViewType', viewType);
                    this.setUI('selectedViewData', viewData);
                    this.setUI('selectedTabIndex', 0)
                },
                uiOnClose: function () {
                    this.setUI('showPreview', true);
                },
                uiOnSearch: function (event) {
                    const searchKey = event.target.value;
                    this.setUI('searchKey', searchKey);
                    const params = searchKey ? this.ui.selectedFilter === 'userId' ? { [this.ui.selectedFilter]: `con:${searchKey}` } : { [this.ui.selectedFilter]: searchKey } : {};
                    return wizardPage.page.ds.getPartnerList({}, { params });
                },
            };
        })(pageArgs, pageUtil)
    );


    return (
        <Grid className="partners-details-view-container">
            <Column lg={8} className="partners-details-list">
                <Tabs>
                    <TabList aria-label="List of tabs">
                        <Tab><PartnersTabIcon /><span className="partners-tab-title">Partners</span></Tab>
                        <Tab><AttributesTabIcon /><span className="partners-tab-title">Attributes</span></Tab>
                        <Tab><GroupsTabIcon /><span className="partners-tab-title">Group</span></Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Grid className="define-grid-partner">
                                {/* Search Box */}
                                <Column className="col-margin" lg={8}>
                                    <Search
                                        size="lg"
                                        placeholder="Search by partner"
                                        labelText=""
                                        closeButtonLabelText="Clear search input"
                                        id={`trading-partners-search`}
                                        onChange={(event) => page.uiOnSearch(event)}
                                        value={page.ui.searchKey}
                                    />
                                </Column>
                                {/* Filter Dropdown */}
                                <Column className="col-margin" lg={8}>
                                    <Select id={`trading-partners-select`} labelText="" value={[page.ui.selectedFilter]} onChange={(e) => { page.uiOnHandlePartnerChangeType(e) }}>
                                        <SelectItem value="searchText" text="Company/Unique ID" />
                                        <SelectItem value="userId" text="User ID (Email)" />
                                    </Select>
                                </Column>
                                {wizardPage.page.model.partnerList.length === 0 || wizardPage.page.ui.filterPartnerList.length === 0 ? (
                                    <Column className="col-margin" lg={16}>
                                        <p id={`attribute-list-label`} className="no-data-display-text">No Data to Display</p>
                                    </Column>
                                ) : (
                                    <>
                                        <Column lg={16}>  {wizardPage.page.ui.errorWizard !== undefined && (<span className='errorMessage'>{wizardPage.page.ui.errorWizard}</span>)}</Column>
                                        <Column className="select-all-checkbox" lg={8}>
                                            <Checkbox id="select_all-partners" checked={page.ui.partnerIsChecked} onChange={() => { page.uiOnSelectAllPartners() }} labelText="Select All" />
                                        </Column>
                                        {page.ui.selectedPartners.size > 0 && (
                                            <>
                                                <Column className="col-margin" lg={8}>
                                                    <Button size="sm" className="new-button" renderIcon={Add} onClick={() => (wizardPage.page.uiHandleAddBtn('Partner', Array.from(page.ui.selectedPartnersData)))}>Add</Button>
                                                </Column>
                                            </>)}
                                        {wizardPage.page.ui.filterPartnerList.map(item => (
                                            <Column className="col-margin" lg={16} key={item.partnerUniqueId}>
                                                <div className="partners-data-item">
                                                    <Checkbox checked={page.ui.selectedPartners.has(item.partnerUniqueId)} onChange={() => { page.uiOnSelectPartners(item) }} id={item.partnerUniqueId} name={item.partnerUniqueId} labelText="" className="checkbox-input" />
                                                    <span className="partner-checkbox-label" onClick={() => { page.uiOnHandleDetailsViewClick(item, 'Partner') }}>{wizardPage.page.uiCapitalizeFirstLetter(item.nameOfCompany)}</span>
                                                </div>
                                            </Column>
                                        ))}
                                    </>
                                )}
                            </Grid>
                        </TabPanel>
                        <TabPanel> {/* Attribute Tab Content */}</TabPanel>
                        <TabPanel>{/* Group tab content */}</TabPanel>
                    </TabPanels>
                </Tabs>
            </Column>
            <Column lg={1} className="right-arrow-container">  <RightArrow /></Column>
            <Column lg={7} className="partners-details-view"><RolloutPreview previewPage={page} wizardPage={wizardPage} /></Column>
        </Grid >
    );
};

export default RolloutWizard;
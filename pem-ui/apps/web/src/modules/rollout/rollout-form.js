import React from 'react';
import { Grid, Column, Button, Tag } from '@carbon/react';
import { CDS } from '@b2bi/shell';
import { VectorIcon } from './icons';

const RolloutForm = ({ page, pageUtil }) => {
    return (
        <CDS.Form name="rollout" context={page.form.rollout} requiredLabelSuffix={true}>
            <Grid>
                <Column className='col-margin' lg={12}>
                    {/* Name */}
                    <CDS.TextInput
                        labelText='Name'
                        name="rolloutName"
                        placeholder='Enter Name'
                        rules={{
                            required: true,
                            minLength: 1,
                            maxLength: 30,
                            pattern: {
                                value: /^[a-zA-Z0-9@#%^&*(){}[\]+=;:"'!?/.,\\|~`\s]*$/i,
                                message: pageUtil.t('mod-sponsor-server:message.nameErrorMessage')
                            }
                        }}
                    />
                </Column>
                {/* Description */}
                <Column className='col-margin' lg={12}>
                    <CDS.TextArea
                        labelText='Description'
                        name="rolloutDescription"
                        rows={3}
                        enableCounter={true}
                        counterMode="character"
                        maxCount={100}
                        placeholder='Enter Description'
                    />
                </Column>
                {/* View Context Data */}
                <Column className="col-margin" lg={16}>
                    <Button kind="tertiary" size="md" onClick={() => page.setUI('showContextData', !page.ui.showContextData)}>
                        {page.ui.showContextData ? 'Hide Context Data' : 'View Context Data'}
                    </Button>
                </Column>
                {/* Context Data */}
                {page.ui.showContextData && (
                    <>
                        <Column className="col-margin" lg={11}>
                            <div style={{ width: '100%' }}>
                                <CDS.TextArea
                                    labelText=""
                                    rows={3}
                                    placeholder="Enter Context Data"
                                    className="contextData-wrapper"
                                    id="rolloutContextData"
                                    name="rolloutContextData"
                                    rules={{
                                        required: true,
                                        validate: () => {
                                            try {
                                                JSON.parse(page.form.rollout.watch('rolloutContextData'))
                                                return true;
                                            } catch (e) {
                                                return false
                                            }
                                        }
                                    }}
                                    style={{ maxHeight: '200px', overflowY: page.ui.showCode ? 'hidden' : 'auto', paddingRight: '6.25rem' }}
                                />
                                <Button size="sm" kind="ghost" onClick={() => page.setUI('showCode', !page.ui.showCode)} className="btn-show-code">
                                    {page.ui.showCode ? 'Show Code' : 'Hide Code'}
                                </Button>
                            </div>
                        </Column>
                        <Column lg={5} style={{ marginLeft: '0rem', marginTop: '0.40rem' }}>
                            <Button className="context-mapping-btn" kind="tertiary" renderIcon={VectorIcon} onClick={page.uiOnShowContextData} size="sm" hasIconOnly iconDescription="Context Mapping" tooltipAlignment="center" />
                        </Column>
                    </>)}
                {/* Due Date */}
                <Column className="col-margin" lg={4}>
                    <CDS.DateInput allowInput={false} rules={{
                        required: page.form.rollout.watch('rolloutAlertDate').length !== 0 || page.form.rollout.watch('rolloutAlertInterval') !== ''
                    }} infoText={'Due date cannot be earlier than today.'} labelText='Due Date' name='rolloutDueDate' minDate={page.uiGetMinDate(0)} />
                </Column>
                {/* Alert Date */}
                <Column className="col-margin" lg={4}>
                    <CDS.DateInput allowInput={false}
                        rules={{
                            required: page.form.rollout.watch('rolloutDueDate').length !== 0 && page.form.rollout.watch('rolloutAlertInterval') !== ''
                        }}
                        infoText={'Alert date cannot be today or earlier than today. Cannot be same or later than due date. Email alert notifications are sent to partners.'} labelText='Alert Date' name='rolloutAlertDate' minDate={page.uiGetMinDate(1, page.form.rollout.watch('rolloutDueDate')[0])} />
                </Column>
                {/* Alert Interval */}
                <Column className="col-margin" lg={4}>
                    <CDS.TextInput
                        className='alertIntervalWapper'
                        rules={{
                            required: page.form.rollout.watch('rolloutDueDate').length !== 0 && page.form.rollout.watch('rolloutAlertDate').length !== 0,
                            pattern: {
                                value: /^(?:[1-9]|[1-9][0-9])$/i,
                                message: pageUtil.t('shell:form.validations.number')
                            }
                        }}
                        infoText={'Specify the alert email frequency in days. Enter the alert interval value in the range 1 - 99 days.'}
                        name='rolloutAlertInterval'
                        labelText='Alert Interval' />
                </Column>
                {/* Rolling Out to */}
                <Column className="col-margin" lg={12}>
                    <CDS.RadioButtonGroup legendText="Rolling out to" name="rolloutRollingOut" valueSelected={page.form.rollout.watch('rolloutRollingOut')}>
                        <CDS.RadioButton labelText="Partners" value="partners" id="partners" />
                        <CDS.RadioButton labelText="Internal Users" value="internal_users" id="internal_users" />
                    </CDS.RadioButtonGroup>
                </Column>
                {/* Partners, group, Attribute */}
                {page.form.rollout.watch('rolloutRollingOut') === "partners" && (
                    (page.ui.partnersData.length === 0 && page.ui.attributesData.length === 0 && page.ui.groupsData.length === 0) ? (
                        <>
                            <Column className="partners_rollout-container" lg={12}>
                                <CDS.TextArea
                                    name='rolloutRollingOutValue'
                                    labelText='Partners, groups, Attributes'
                                    rules={{ required: true }}
                                    placeholder='Enter Partners, groups, Attributes'
                                />
                                <Button className="add-button" onClick={() => page.setUI('partnerPage', !page.ui.partnerPage)}>
                                    Add
                                </Button>
                            </Column>
                        </>) : (
                        <> <Column className="partners_rollout-container" lg={12}>
                            <div className="partners_tags">
                                {page.ui.partnersData.length > 0 && (
                                    <>
                                        {page.ui.partnersData.map((item) => {
                                            return (
                                                <Tag id={item.partnerKey} className="some-class" type="blue" filter onClose={() => page.uiOnHandleRemove('Partner', [item.partnerUniqueId])} key={item.partnerUniqueId}>
                                                    {page.uiCapitalizeFirstLetter(item.nameOfCompany)}
                                                </Tag>
                                            );
                                        })}
                                    </>
                                )}
                                {page.ui.attributesData.length > 0 && (
                                    <>
                                        {page.ui.attributesData.map((item) => {
                                            return (
                                                <Tag
                                                    id={item.attributeValueKey}
                                                    className="some-class"
                                                    type="blue"
                                                    filter
                                                    onClose={() => page.uiOnHandleRemove('Attribute', [item.attributeValueKey])}
                                                    key={item.attributeValueKey}
                                                >
                                                    {page.uiCapitalizeFirstLetter(item.name)}
                                                </Tag>
                                            );
                                        })}
                                    </>
                                )}
                                {page.ui.groupsData.length > 0 && (
                                    <>
                                        {page.ui.groupsData.map((item) => {
                                            return (
                                                <Tag id={item.value} className="some-class" type="blue" filter onClose={() => page.uiOnHandleRemove('Groups', [item.groupUniqueId])} key={item.groupUniqueId}>
                                                    {page.uiCapitalizeFirstLetter(item.value)}
                                                </Tag>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                            <Button className="add-button" onClick={() => page.setUI('partnerPage', !page.ui.partnerPage)}>
                                Edit
                            </Button>
                        </Column>
                        </>
                    )

                )}

            </Grid>
        </CDS.Form >
    );
};

export default RolloutForm;
import React from 'react';
import { DownToBottom, UpToTop, Copy, Locked, Unlocked } from '@carbon/icons-react';
import { getCompatContextProvider } from 'react-querybuilder';
import CarbonValueEditor from './carbon-value-editor';
import carbonValueSelector from './carbon-value-selector';
import CarbonActionElement from './carbon-action-element';
import CarbonOperatorSelector from './carbon-operator-selector';
import CarbonRemoveRuleAction from './carbon-remove-rule-action';

export const carbonControlElements = {
  actionElement: CarbonActionElement,
  removeRuleAction: CarbonRemoveRuleAction,
  removeGroupAction: CarbonRemoveRuleAction,
  valueSelector: carbonValueSelector,
  operatorSelector: CarbonOperatorSelector,
  valueEditor: CarbonValueEditor
};

export const carbonTranslations = {
  cloneRuleGroup: { label: <Copy /> },
  cloneRule: { label: <Copy /> },
  lockGroup: { label: <Unlocked /> },
  lockRule: { label: <Unlocked /> },
  lockGroupDisabled: { label: <Locked /> },
  lockRuleDisabled: { label: <Locked /> },
  shiftActionDown: { label: <DownToBottom /> },
  shiftActionUp: { label: <UpToTop /> }
};

const CarbonWrapper = getCompatContextProvider({
  key: 'carbon',
  controlElements: carbonControlElements,
  translations: carbonTranslations
});

export default CarbonWrapper;

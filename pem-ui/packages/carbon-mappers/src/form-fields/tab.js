import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelValidationFields, PropsPanelFields } from '../constant';
import { NewTab } from '@carbon/icons-react';
import PageDesigner from '@b2bi/page-designer';

const type = FORM_FIELD_TYPE.TAB;

const CustomTab = ({ renderRow, row, currentPath, handleDrop, componentMapper, onFieldSelect, onFieldDelete, previewMode, onChangeHandle, isSelected, setIsSelected }) => {
  return (
    <Tabs data-testid={'test-tab'}>
      <TabList aria-label="List of tabs">
        {row.children.map((tabItem, idx) => {
          const { tabTitle } = tabItem;
          return (
            <Tab
              onClick={(e) => {
                !previewMode && onFieldSelect(e, tabItem, `${currentPath}-${idx}`);
              }}
            >
              {tabTitle}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels>
        {row.children.map(({ children }, idx) => {
          return (
            <TabPanel>
              <PageDesigner.TabCanvas
                layout={children}
                handleDrop={handleDrop}
                renderRow={renderRow}
                componentMapper={componentMapper}
                path={`${currentPath}-${idx}`}
                onFieldSelect={onFieldSelect}
                onFieldDelete={onFieldDelete}
                previewMode={previewMode}
                onChangeHandle={onChangeHandle}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
              />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTab;

// Config of Tab for Left Palette & Right Palette
CustomTab.config = {
  type,
  label: FORM_FIELD_LABEL.TAB,
  group: FORM_FIELD_GROUPS.PANEL,
  icon: <NewTab />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};

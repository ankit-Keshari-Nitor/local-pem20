import { Column, Grid, RadioButton, RadioButtonGroup, Tab, TabList, TabPanel, TabPanels, Tabs, TextInput } from '@carbon/react';
import React from 'react';

export const FormPropsPanel = () => {
  return (
    <div className="right-palette-container">
      <Tabs>
        <TabList>
          <Tab>Define</Tab>
          <Tab>Styles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Define</TabPanel>
          <TabPanel>
            <Grid style={{ marginTop: '2rem' }}>
              <Column lg={10}>
                <RadioButtonGroup>
                  <RadioButton labelText={'Default'} />
                  <RadioButton labelText={'Custom'} />
                </RadioButtonGroup>
              </Column>
              <Column style={{ marginRight: '1rem' }} lg={8}>
                <TextInput labelText={'Font'} />
              </Column>
              <Column lg={8}>
                <TextInput labelText={'Font Size'} />
              </Column>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default FormPropsPanel;

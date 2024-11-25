import { Column, Grid, RadioButton, RadioButtonGroup, Select, SelectItem, Tab, TabList, TabPanel, TabPanels, Tabs, TextInput } from '@carbon/react';
import React, { useRef } from 'react';
import { FONT_FAMILY, FONT_SIZE, FONT_STYLE } from '../../constants/constants';

export const FormPropsPanel = ({ formFieldProps, onFormPropsChange }) => {
  const formProps = useRef();
  formProps.current = formFieldProps[0];
  // const { customProps, ...rest } = formProps.current;
  //const font= '16px'
  return (
    <div className="right-palette-container">
      {/* <style>
        {
          `
            .right-palette-container {
              .cds--label {
                ${obj}
              }
            }
          `
        }
      </style> */}
      <Tabs>
        <TabList>
          <Tab>Define</Tab>
          <Tab>Styles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid style={{ marginTop: '1rem', marginLeft: '0.5rem' }}>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-name'}
                  labelText={'Form Name'}
                  value={formProps.current.name}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      name: e.target.value
                    })
                  }
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-id'}
                  labelText={'ID (required)'}
                  value={formProps.current.id}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      id: e.target.value
                    })
                  }
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-width'}
                  labelText={'Width in px (required)'}
                  value={formProps.current.width}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      width: e.target.value
                    })
                  }
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-height'}
                  labelText={'Height in px (required)'}
                  value={formProps.current.height}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      height: e.target.value
                    })
                  }
                />
              </Column>
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid style={{ marginTop: '1rem', marginLeft: '0.75rem' }}>
              {/* <Column lg={10}>
                <RadioButtonGroup
                  id={'form-style-opt'}
                  name={`radio-group-style`}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      defaultStyle: e === 'Default' ? true : false
                    })
                  }
                  valueSelected={formProps.current.defaultStyle ? 'Default' : 'Custom'}
                >
                  <RadioButton key={'Default'} labelText={'Default'} value={'Default'} />
                  <RadioButton key={'Custom'} labelText={'Custom'} value={'Custom'} />
                </RadioButtonGroup>
              </Column> */}
              <Column className="props-field" lg={8}>
                <Select
                  id={'form-font'}
                  labelText={'Font'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      fontFamily: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   fontFamily: e.target.value
                      // }
                    })
                  }
                  //readOnly={formProps.current?.defaultStyle}
                  defaultValue={formProps.current?.fontFamily}
                  value={formProps.current?.fontFamily}
                >
                  {FONT_FAMILY.map((family, index) => {
                    return <SelectItem key={`Font-${index}`} value={family.fontFamily} text={family.fontFamily} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  id={'form-font-size'}
                  labelText={'Font Size'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      fontSize: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   fontSize: e.target.value
                      // }
                    })
                  }
                  //readOnly={formProps.current?.defaultStyle}
                  defaultValue={formProps.current?.fontSize}
                  value={formProps.current?.fontSize}
                >
                  {FONT_SIZE.map((fontSize, index) => {
                    return <SelectItem key={`FontSize-${index}`} value={fontSize.fontSize} text={fontSize.fontSize} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-color'}
                  labelText={'Font Color'}
                  value={formProps.current?.fontColor}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      fontColor: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   fontColor: e.target.value
                      // }
                    })
                  }
                  //readOnly={formProps.current?.defaultStyle}
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-background'}
                  labelText={'Form Background'}
                  value={formProps.current?.formBackground}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      formBackground: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   formBackground: e.target.value
                      // }
                    })
                  }
                  readOnly={formProps.current?.defaultStyle}
                />
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  id={'form-label-style'}
                  labelText={'Label Style'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      labelStyle: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   labelStyle: e.target.value
                      // }
                    })
                  }
                  defaultValue={formProps.current?.labelStyle}
                  value={formProps.current?.labelStyle}
                  //readOnly={formProps.current?.defaultStyle}
                >
                  {FONT_STYLE.map((fontStyle, index) => {
                    return <SelectItem key={`fontStyle-${index}`} value={fontStyle.value} text={fontStyle.fontStyle} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  id={'form-label-font-size'}
                  labelText={'Label Font Size'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      labelFontSize: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   labelFontSize: e.target.value
                      // }
                    })
                  }
                  defaultValue={formProps.current?.labelFontSize}
                  value={formProps.current?.labelFontSize}
                  //readOnly={formProps.current?.defaultStyle}
                >
                  {FONT_SIZE.map((fontSize, index) => {
                    return <SelectItem key={`LabelFontSize-${index}`} value={fontSize.fontSize} text={fontSize.fontSize} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  id={'form-label-color'}
                  labelText={'Label Color'}
                  value={formProps.current?.labelColor}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...formProps.current,
                      labelColor: e.target.value
                      // ...rest,
                      // customProps: {
                      //   ...customProps,
                      //   labelColor: e.target.value
                      // }
                    })
                  }
                  //readOnly={formProps.current?.defaultStyle}
                />
              </Column>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default FormPropsPanel;

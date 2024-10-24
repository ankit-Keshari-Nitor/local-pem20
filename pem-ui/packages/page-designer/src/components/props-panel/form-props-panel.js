import { Column, Grid, RadioButton, RadioButtonGroup, Select, SelectItem, Tab, TabList, TabPanel, TabPanels, Tabs, TextInput } from '@carbon/react';
import React, { useRef } from 'react';
import { FONT_FAMILY, FONT_SIZE, FONT_STYLE } from '../../constants/constants';

export const FormPropsPanel = ({ formFieldProps, onFormPropsChange }) => {
  console.log('formFieldProps>>>', formFieldProps);
  const formProps = useRef();
  formProps.current = formFieldProps[0];
  const { customProps, ...rest } = formProps.current;
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
            <Grid style={{ marginTop: '1rem', marginLeft: '1rem'  }}>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'Form Name'}
                  value={formProps.current.name}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps,
                      name: e.target.value
                    })
                  }
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'ID (required)'}
                  value={formProps.current.id}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps,
                      id: e.target.value
                    })
                  }
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'Width in px (required)'}
                  value={formProps.current.width}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps,
                      width: e.target.value
                    })
                  }
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'Height in px (required)'}
                  value={formProps.current.height}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps,
                      height: e.target.value
                    })
                  }
                />
              </Column>
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid style={{ marginTop: '2rem', marginLeft: '1rem' }}>
              <Column lg={10}>
                <RadioButtonGroup
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
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  labelText={'Font'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        fontFamily: e.target.value
                      }
                    })
                  }
                  readOnly={formProps.current?.defaultStyle}
                  defaultValue={formProps.current?.defaultStyle ? formProps.current?.defaultProps.fontFamily : formProps.current?.customProps.fontFamily}
                  value={formProps.current?.defaultStyle ? formProps.current?.defaultProps.fontFamily : formProps.current?.customProps.fontFamily}
                >
                  {FONT_FAMILY.map((family, index) => {
                    return <SelectItem key={`Font-${index}`} value={family.fontFamily} text={family.fontFamily} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  labelText={'Font Size'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        fontSize: e.target.value
                      }
                    })
                  }
                  readOnly={formProps.current?.defaultStyle}
                  defaultValue={formProps.current?.defaultStyle ? formProps.current?.defaultProps.fontSize : formProps.current?.customProps.fontSize}
                  value={formProps.current?.defaultStyle ? formProps.current?.defaultProps.fontSize : formProps.current?.customProps.fontSize}
                >
                  {FONT_SIZE.map((fontSize, index) => {
                    return <SelectItem key={`FontSize-${index}`} value={fontSize.fontSize} text={fontSize.fontSize} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'Font Color'}
                  value={formProps.current?.defaultStyle ? formProps.current?.defaultProps.fontColor : formProps.current?.customProps.fontColor}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        fontColor: e.target.value
                      }
                    })
                  }
                  readOnly={formProps.current?.defaultStyle}
                />
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'Form Background'}
                  value={formProps.current?.defaultStyle ? formProps.current?.defaultProps.formBackground : formProps.current?.customProps.formBackground}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        formBackground: e.target.value
                      }
                    })
                  }
                  readOnly={formProps.current?.defaultStyle}
                />
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  labelText={'Label Style'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        labelStyle: e.target.value
                      }
                    })
                  }
                  defaultValue={formProps.current?.defaultStyle ? formProps.current?.defaultProps.labelStyle : formProps.current?.customProps.labelStyle}
                  value={formProps.current?.defaultStyle ? formProps.current?.defaultProps.labelStyle : formProps.current?.customProps.labelStyle}
                  readOnly={formProps.current?.defaultStyle}
                >
                  {FONT_STYLE.map((fontStyle, index) => {
                    return <SelectItem key={`fontStyle-${index}`} value={fontStyle.value} text={fontStyle.fontStyle} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <Select
                  labelText={'Label Font Size'}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        labelFontSize: e.target.value
                      }
                    })
                  }
                  defaultValue={formProps.current?.defaultStyle ? formProps.current?.defaultProps.labelFontSize : formProps.current?.customProps.labelFontSize}
                  value={formProps.current?.defaultStyle ? formProps.current?.defaultProps.labelFontSize : formProps.current?.customProps.labelFontSize}
                  readOnly={formProps.current?.defaultStyle}
                >
                  {FONT_SIZE.map((fontSize, index) => {
                    return <SelectItem key={`LabelFontSize-${index}`} value={fontSize.fontSize} text={fontSize.fontSize} />;
                  })}
                </Select>
              </Column>
              <Column className="props-field" lg={8}>
                <TextInput
                  labelText={'Label Color'}
                  value={formProps.current?.labelColor}
                  onChange={(e) =>
                    onFormPropsChange({
                      ...rest,
                      customProps: {
                        ...customProps,
                        labelColor: e.target.value
                      }
                    })
                  }
                  readOnly={formProps.current?.defaultStyle}
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
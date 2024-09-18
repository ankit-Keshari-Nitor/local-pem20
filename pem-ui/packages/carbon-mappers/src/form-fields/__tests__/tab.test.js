import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomTab from '../tab'; // Adjust the import path as necessary
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE } from '../../constant';
import { NewTab } from '@carbon/icons-react';
import PageDesigner from '@b2bi/page-designer';

// Mock PageDesigner.TabCanvas to avoid dealing with its internal implementation
jest.mock('@b2bi/page-designer', () => ({
  TabCanvas: jest.fn(() => <div>Mocked TabCanvas</div>)
}));

// Mock window.matchMedia
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    };
  };

const mockProps = {
  renderRow: jest.fn(),
  row: {
    children: [
      { tabTitle: 'Tab 1', children: [] },
      { tabTitle: 'Tab 2', children: [] }
    ]
  },
  currentPath: 'path',
  handleDrop: jest.fn(),
  componentMapper: jest.fn(),
  onFieldSelect: jest.fn(),
  onFieldDelete: jest.fn(),
  previewMode: false,
  onChangeHandle: jest.fn()
};

describe('CustomTab Component', () => {
  it('renders the tab list and panels correctly', () => {
    render(<CustomTab {...mockProps} />);

    // Check if the tab list is rendered
    expect(screen.getByRole('tablist')).toBeInTheDocument();

    // Check if the tab titles are rendered
    mockProps.row.children.forEach((tab) => {
      expect(screen.getByText(tab.tabTitle)).toBeInTheDocument();
    });

    // Check if TabCanvas components are rendered for each tab
    expect(PageDesigner.TabCanvas).toHaveBeenCalledTimes(mockProps.row.children.length);
  });

  it('handles tab click event correctly', () => {
    render(<CustomTab {...mockProps} />);

    // Simulate a click on the first tab
    fireEvent.click(screen.getByText('Tab 1'));

    // Check if the onFieldSelect function is called with the correct arguments
    expect(mockProps.onFieldSelect).toHaveBeenCalledWith(expect.any(Object), mockProps.row.children[0], 'path-0');

    // Simulate a click on the second tab
    fireEvent.click(screen.getByText('Tab 2'));

    // Check if the onFieldSelect function is called with the correct arguments
    expect(mockProps.onFieldSelect).toHaveBeenCalledWith(expect.any(Object), mockProps.row.children[1], 'path-1');
  });

  it('does not call onFieldSelect in preview mode', () => {
    render(<CustomTab {...{ ...mockProps, previewMode: true }} />);

    // Simulate a click on the first tab in preview mode
    fireEvent.click(screen.getByText('Tab 1'));

    // Check if the onFieldSelect function is not called
    expect(mockProps.onFieldSelect).not.toHaveBeenCalled();
  });

  it('renders the config correctly', () => {
    expect(CustomTab.config).toEqual({
      type: FORM_FIELD_TYPE.TAB,
      label: FORM_FIELD_LABEL.TAB,
      group: FORM_FIELD_GROUPS.PANEL,
      icon: <NewTab />,
      editableProps: {
        Basic: [],
        Condition: []
      },
      advanceProps: []
    });
  });
});

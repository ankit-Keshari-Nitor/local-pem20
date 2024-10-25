export const SIDEBAR_ITEM = 'sidebarItem';
export const ROW = 'row';
export const COLUMN = 'column';
export const COMPONENT = 'component';
export const GROUP = 'group';
export const ACCORDION = 'accordion';
export const TAB = 'tab';
export const DEFAULTTITLE = 'Title';
export const CUSTOM_COLUMN = 'customColumn';
export const SUBTAB = 'subTab';
export const CUSTOM_SIZE = 'customsize';
export const CUSTOM_TITLE = 'customTitle';
export const TEXT_INPUT = 'TextInput';
export const NAME = 'name';
export const REGEXVALIDATION = 'regexValidation';
export const MAXPROPS = 'max';
export const MINPROPS = 'min';
export const OPTIONS = 'Options';
export const CUSTOMREGEX = 'customRegex';
export const DATATABLE = 'data-table';
export const TABLE_COLUMNS = 'tableColumns';
export const TABLE_ROWS = 'tableRows';
export const LABEL_TEXT = 'labelText';
export const ISREQUIRED = 'isRequired';
export const ADD_TAB_BTN = 'addTabBtn';
export const ADD_COLUMN_BTN = 'addColumnBtn';
export const MAPPING = 'mapping';
export const SELECT = 'select';
export const TOGGLE = 'Toggle';
export const TEXT = 'text';
export const RADIO = 'radio';
export const CHECKBOX = 'checkbox';
export const DROPDOWN = 'DropDown';
export const FILE_UPLOAD = 'FileUpload';
export const ELEMENT_TYPES = 'elementType';
export const EXTENSIONS = 'extensions';

export const PALETTE_GROUPS = [
  {
    label: 'Basic input',
    id: 'basic-input'
  },
  {
    label: 'Selection',
    id: 'selection'
  },
  {
    label: 'Panel',
    id: 'panel'
  },
  {
    label: 'Containers',
    id: 'container'
  },
  {
    label: 'Action',
    id: 'action'
  }
];

export const INITIAL_DATA = {
  layout: [],
  components: {}
};

export const TABLE_HEADER = [
  {
    key: 'column1',
    header: 'column1',
    colSpan: '6',
    searchable: false,
    sortable: false,
    required: false
  },
  {
    key: 'column2',
    header: 'column2',
    colSpan: '6',
    searchable: false,
    sortable: false,
    required: false
  }
];

export const OPTION = [
  {
    label: '',
    id: '',
    value: ''
  }
];

export const GROUP_MENU = [
  {
    key: 'Label',
    value: 'Label'
  },
  {
    key: 'Single line input',
    value: 'Input Element'
  },
  {
    key: 'radio',
    value: 'Radio Checkbox Dropdown'
  },
  {
    key: 'Table',
    value: 'Table'
  },
  {
    key: 'Image',
    value: 'Image'
  },
  {
    key: 'Toggle',
    value: 'Toggle'
  },
  {
    key: 'Hyperlink',
    value: 'Hyperlink'
  },
  {
    key: 'File Upload',
    value: 'Upload'
  },
  {
    key: 'File Download',
    value: 'Download'
  },
  {
    key: 'Help',
    value: 'Help Info'
  }
];

/* Form Properties */

export const FONT_SIZE = [{ fontSize: '14px' }, { fontSize: '16px' }, { fontSize: '18px' }, { fontSize: '20px' }, { fontSize: '22px' }];

export const FONT_FAMILY = [
  { fontFamily: 'IBM Plex Sans' },
  { fontFamily: 'IBM Plex Serif' },
  { fontFamily: 'IBM Plex Mono' },
  { fontFamily: 'Inter' },
  { fontFamily: 'Calibri' },
  { fontFamily: 'Arial' },
  { fontFamily: 'Sans-serif' }
];

export const FONT_STYLE = [
  { fontStyle: 'Light', value: '300' },
  { fontStyle: 'Normal', value: '400' },
  { fontStyle: 'Medium', value: '500' },
  { fontStyle: 'Semi bold', value: '600' }
];

/* Prefix Constant for Form/Elements ids*/
export const ELEMENT_PREFIX = {
  grid: 'grid',
  row: 'row',
  column: 'column',
  label: 'label',
  textInput: 'textInput',
  textArea: 'testArea',
  password: 'password',
  radioGroup: 'radioGroup',
  checkBoxGroup: 'checkBoxGroup',
  dropDown: 'dropDown',
  toggle: 'toggle',
  number: 'number',
  hyperLink: 'hyperLink',
  info: 'info',
  helpText: 'helpText',
  fileUpload: 'fileUpload',
  fileDownload: 'fileDownload',
  date: 'date',
  dataTable: 'dataTable'
};

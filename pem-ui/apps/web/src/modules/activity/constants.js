export const ROUTES = {
  NEW_ACTIVITY: '#/activities/new',
  ACTIVITY_LIST: '#/activities',
  ACTIVITY_EDIT: '#/activities/'
};

export const API_END_POINTS = {
  ACTIVITY_DEFINITION: '/sponsors/cashbank/v2/activityDefinitions',
  ACTIVITY_INSTANCE: '/sponsors/{sponsorContext}/v2/activityInstances',
  ACTIVITY_DEFINITION_VERSION: '/sponsors/sponsorContext/v2/activityDefinitions/activityDefnKey/version',



  ATTRIBUTE_TYPES: '/rest/sponsors/b2b/attributetypes/',
  ATTRIBUTE_LIST: '/rest/sponsors/b2b/attributetypes',
  PARTNERS_LIST: '/rest/sponsors/b2b/partners/',
  ACTIVITY_DEFINITION_ROLLOUT: '/sponsors/cashbank//v2/activityInstances',

  API_CONFIGURATION: '/rest/sponsors/b2b/apiconfigurations/',
  ACTIVITY_FILE: '/rest/sponsors/b2b/vchdocuments/',
  ROLES: '/sponsors/cashbank/v2/roles?pageNo=0&pageSize=10&sortBy=modifyTs&sortDir=DESC'
};

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE'
};
export const ACTION_COLUMN_KEYS = {
  NAME: 'name',
  ENCRYPTED: 'isEncrypted',
  STATUS: 'status',
  VERSION: 'version',
  ACTIONS: 'action',
  ELLIPSIS: 'ellipsis',
  ROLLOUT: 'Rollout',
  VIEW: 'View',
  TEST_ACTIVITY: 'Test Activity',
  TEST_VERSION: 'Test Version',
  DELETE: 'Delete',
  SHARE_UNSHARE: 'Share/Unshared',
  EXPORT_ACTIVITY: 'Export Activity',
  EXPORT_VERSION: 'Export Version',
  MARK_AS_FINAL: 'Mark As Final',
  EDIT: 'Edit',
  CLONE_ACTIVITY: 'Clone Activity',
  CLONE_VERSION: 'Clone Version',
  MARK_AS_DEFAULT: 'Mark As Default',
  ACTIVITYDEFVERSIONKEY: 'activityDefnVersionKey',
  RESTORE: 'Restore',
  DESCRCIPTION: 'description',
  ISDEFAULT: 'isDefault'
};

export const ACTIVITY_LIST_COLUMNS = [
  { key: ACTION_COLUMN_KEYS.NAME, header: 'Activity Name' },
  //{ key: ACTION_COLUMN_KEYS.ENCRYPTED, header: 'Encrypted' },
  { key: ACTION_COLUMN_KEYS.STATUS, header: 'Status' },
  { key: ACTION_COLUMN_KEYS.VERSION, header: 'Default Version' },
  { key: ACTION_COLUMN_KEYS.ACTIONS, header: 'Actions' },
  { key: ACTION_COLUMN_KEYS.ELLIPSIS, header: '' },
  { key: ACTION_COLUMN_KEYS.ACTIVITYDEFVERSIONKEY, header: '' },
  { key: ACTION_COLUMN_KEYS.DESCRCIPTION, header: '' }
];

export const ACTIVITY_VERSION_COLUMNS = [
  { key: ACTION_COLUMN_KEYS.VERSION, header: 'Version' },
  //{ key: ACTION_COLUMN_KEYS.ENCRYPTED, header: 'Encrypted' },
  { key: ACTION_COLUMN_KEYS.STATUS, header: 'Status' },
  { key: ACTION_COLUMN_KEYS.ACTIONS, header: 'Actions' },
  { key: ACTION_COLUMN_KEYS.ELLIPSIS, header: '' },
  { key: ACTION_COLUMN_KEYS.ACTIVITYDEFVERSIONKEY, header: '' },
  { key: ACTION_COLUMN_KEYS.DESCRCIPTION, header: '' },
  { key: ACTION_COLUMN_KEYS.ISDEFAULT, header: '' }
];

export const ROLLOUT_STEPS = [
  {
    id: 'step1',
    label: 'Step 1',
    secondaryLabel: 'Rollout details'
  },
  {
    id: 'step2',
    label: 'Step 2',
    secondaryLabel: 'Select Group, Attributes, Partners'
  }
];

export const ATTRIBUTE_TYPES = [
  {
    name: 'RequestType',
    attributeTypeKey: '64a285c4-a4a3-4fb1-8f00-9fecf1ed3da9',
    visibility: {
      code: 'SPONSOR',
      display: 'Sponsor Only'
    }
  },
  {
    name: 'SubResourceType',
    attributeTypeKey: '6317cc3b-c709-4c5a-9525-308828db757b',
    visibility: {
      code: 'SPONSOR',
      display: 'Sponsor Only'
    }
  },
  {
    name: 'My Partners',
    attributeTypeKey: 'ee679ea2-d573-4075-b16c-b8addd344c6d',
    visibility: {
      code: 'SPONSOR',
      display: 'Sponsor Only'
    }
  }
];

export const GROUP_LIST_DATA = [
  { key: 'Group-1_Mapping_delete', value: 'Group-1_Mapping_delete' },
  { key: 'Group-2_Mapping_View', value: 'Group-2_Mapping_View' },
  { key: 'Group-3_Mapping_secAdmin', value: 'Group-3_Mapping_secAdmin' },
  { key: 'Group-4_Mapping_Edit', value: 'Group-4_Mapping_Edit' },
  { key: 'Group-2_Mapping_delete_Notap', value: 'Group-2_Mapping_delete_Notap' },
  { key: 'Group-1_SecAdmin_Appli', value: 'Group-1_SecAdmin_Appli' },
  { key: 'Group-4_SecAdmin_Appli', value: 'Group-4_SecAdmin_Appli' },
  { key: 'Group-12_Mapping_View', value: 'Group-12_Mapping_View' }
];

export const ATTRIBUTE_LIST_DATA = [
  { key: 'Attribute-1_Mapping_delete', value: 'Attribute-1_Mapping_delete' },
  { key: 'Attribute-2_Mapping_View', value: 'Attribute-2_Mapping_View' },
  { key: 'Attribute-3_Mapping_secAdmin', value: 'Attribute-3_Mapping_secAdmin' },
  { key: 'Attribute-4_Mapping_Edit', value: 'Attribute-4_Mapping_Edit' },
  { key: 'Attribute-2_Mapping_delete_Notap', value: 'Attribute-2_Mapping_delete_Notap' },
  { key: 'Attribute-1_SecAdmin_Appli', value: 'Attribute-1_SecAdmin_Appli' },
  { key: 'Attribute-4_SecAdmin_Appli', value: 'Attribute-4_SecAdmin_Appli' },
  { key: 'Attribute-12_Mapping_View', value: 'Attribute-12_Mapping_View' }
];

export const PARTNER_LIST_DATA = [
  { key: 'Partner-1_Mapping_delete', value: 'Partner-1_Mapping_delete' },
  { key: 'Partner-2_Mapping_View', value: 'Partner-2_Mapping_View' },
  { key: 'Partner-3_Mapping_secAdmin', value: 'Partner-3_Mapping_secAdmin' },
  { key: 'Partner-4_Mapping_Edit', value: 'Partner-4_Mapping_Edit' },
  { key: 'Partner-2_Mapping_delete_Notap', value: 'Partner-2_Mapping_delete_Notap' },
  { key: 'Partner-1_SecAdmin_Appli', value: 'Partner-1_SecAdmin_Appli' },
  { key: 'Partner-4_SecAdmin_Appli', value: 'Partner-4_SecAdmin_Appli' },
  { key: 'Partner-12_Mapping_View', value: 'Partner-12_Mapping_View' }
];

export const TEST_DIALOG_DATA = [
  {
    key: 'dialog-1',
    name: 'Dialog 1',
    schema: {
      fields: [
        {
          id: '747c2c05-3adb-4f72-bf2b-434efb622020',
          type: 'component',
          component: {
            type: 'textinput',
            label: 'Text Input',
            group: 'basic-input',
            icon: {
              key: null,
              ref: null,
              props: {},
              _owner: null,
              _store: {}
            },
            labelText: 'Test 1',
            helperText: 'Input helper text'
          }
        },
        {
          type: 'row',
          id: 'ca7fc2a7-2271-4a51-945c-80d22116470d',
          maintype: 'group',
          children: [
            {
              type: 'column',
              id: '61c3ddfb-2e2b-439f-a920-0be2f267f389',
              defaultsize: '16',
              children: [
                {
                  id: '35bbcd42-5676-4c88-b7f5-57c615f44281',
                  type: 'component',
                  component: {
                    type: 'textinput',
                    label: 'Text Input',
                    group: 'basic-input',
                    icon: {
                      key: null,
                      ref: null,
                      props: {},
                      _owner: null,
                      _store: {}
                    },
                    labelText: '1'
                  }
                }
              ],
              customsize: '7'
            },
            {
              type: 'column',
              id: 'b847fe5e-c04e-4920-813c-834d6043749d',
              defaultsize: '16',
              children: [
                {
                  id: '0290205a-fc92-47dd-a99e-ac912b4a18d9',
                  type: 'component',
                  component: {
                    type: 'textinput',
                    label: 'Text Input',
                    group: 'basic-input',
                    icon: {
                      key: null,
                      ref: null,
                      props: {},
                      _owner: null,
                      _store: {}
                    },
                    labelText: '2'
                  }
                }
              ],
              customsize: '7'
            }
          ]
        }
      ]
    }
  },
  {
    key: 'dialog-2',
    name: 'Dialog 2',
    schema: {
      fields: [
        {
          id: 'f9d8a973-c0e4-4770-8114-970af260f7b4',
          type: 'component',
          component: {
            type: 'textarea',
            label: 'Text Area',
            group: 'basic-input',
            icon: {
              key: null,
              ref: null,
              props: {},
              _owner: null,
              _store: {}
            },
            labelText: 'Test Area'
          }
        },
        {
          id: '56160e0a-80d6-4438-a9be-0e2d3e7cd337',
          type: 'component',
          component: {
            type: 'textinput',
            label: 'Text Input',
            group: 'basic-input',
            icon: {
              key: null,
              ref: null,
              props: {},
              _owner: null,
              _store: {}
            },
            labelText: 'Text input'
          }
        }
      ]
    }
  },
  {
    key: 'dialog-3',
    name: 'Dialog 3',
    schema: {
      fields: [{ component: { type: 'textinput', label: 'Text Input', group: 'basic-input', icon: null }, id: '56160e0a-80d6-4438-a9be-0e2d3e7cd337', type: 'component' }]
    }
  }
];

export const ACTIVITY_DEFINITION_DATA = {
  name: '',
  description: '',
  contextData: '',
  encrypt: ''
};

export const OPERATIONS = {
  VIEW: 'View',
  EDIT: 'edit',
  EXPORT: 'export',
  DELETE: 'delete',
  CREATE_NEW_VERSION: 'create_new_version',
  TEST: 'test'
};

export const DUMMY_CONTEXT_DATA =
  '{\n\t"ContextData": {\n\t\t"ProvisioningRequest": {\n\t\t\t"RequestType": "ProvisioningRequest",\n\t\t\t"ResourceType": "CODELIST",\n\t\t\t"SubResourceType": "CodeList",\n\t\t\t"ConfigType": "PROD",\n\t\t\t"ResourceKey": "b7f18eb4-b32f-406a-af16-ebb3ce0d0b34",\n\t\t\t"PartnerKey": "9bf632dc-01a4-4dd9-9302-bc9bc4e5d30d",\n\t\t\t"SponsorKey": "761044dd-adea-404d-9ee2-5d7654de7137"\n\t\t},\n\t\t"Topology": {\n\t\t\t"Applications": {\n\t\t\t\t"SFTP": {\n\t\t\t\t\t"_type": "APIConfig",\n\t\t\t\t\t"__text": "d6314576-8aaa-4bd6-8a23-7ccf79f6ec13"\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}';

// Capitalize the first letter of a string
export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const dialog1 = [
  {
    cType: 'FORM',
    props: {
      id: 'FORM1717354325682',
      uId: 'FORM1717354325682',
      name: 'test'
    },
    children: [
      {
        cType: 'CHECKBOXGROUP',
        props: {
          id: 'CHECKBOXGROUP1717399604917',
          uId: 'CHECKBOXGROUP1717399604917',
          labelText: 'Checkbox Group',
          name: 'configurations',
          legendText: 'Configurations',
          readOnly: false,
          disabled: false,
          required: false,
          outputBinding: 'test.configurations',
          items:
            '[\n  {\n    "name": "active",\n    "labelText": "Active",\n    "readOnly": false,\n    "disabled": false\n  },\n  {\n    "name": "external",\n    "labelText": "External",\n    "readOnly": false,\n    "disabled": false\n  }\n]\n'
        }
      }
    ]
  }
];

const dialog2 = [
  {
    cType: 'FORM',
    props: {
      id: 'FORM1717354325682',
      uId: 'FORM1717354325682',
      name: 'test'
    },
    children: [
      {
        cType: 'CHECKBOXGROUP',
        props: {
          id: 'CHECKBOXGROUP1717399604917',
          uId: 'CHECKBOXGROUP1717399604917',
          labelText: 'Checkbox Group',
          name: 'configurations',
          legendText: 'Configurations',
          readOnly: false,
          disabled: false,
          required: false,
          outputBinding: 'test.status',
          items: [
            {
              name: 'active',
              labelText: 'Dynamic Injected Active',
              readOnly: false,
              disabled: false
            },
            {
              name: 'external',
              labelText: 'Dynamic Injected External',
              readOnly: false,
              disabled: false
            }
          ]
        }
      }
    ]
  }
];

const dialog3 = [
  {
    cType: 'FORM',
    props: {
      id: 'FORM1717354325682',
      uId: 'FORM1717354325682',
      name: 'test'
    },
    children: [
      {
        cType: 'CHECKBOXGROUP',
        props: {
          id: 'CHECKBOXGROUP1717399604917',
          uId: 'CHECKBOXGROUP1717399604917',
          labelText: 'Checkbox Group',
          name: 'configurations',
          legendText: 'Configurations',
          readOnly: false,
          disabled: false,
          required: false,
          outputBinding: 'test.statusNew',
          items: '$.model.configurations'
        }
      }
    ]
  }
];

const ContextDataProperties = [
  {
    type: 'API_CONFIG',
    name: 'ApiConfigProperty',
    value: 'QA_B2BISFG'
  },
  {
    type: 'ACITIVITY_FILE',
    name: 'FileProperty',
    value: ''
  },
  {
    type: 'TEXT',
    name: 'TextProperty',
    value: ''
  },
  {
    type: 'TEXT',
    name: 'TextPropertyInitialValue',
    value: 'Hello PEM'
  },
  {
    type: 'BOOLEAN',
    name: 'BooleanProperty',
    value: false
  },
  {
    type: 'BOOLEAN',
    name: 'BooleanPropertyInitialValue',
    value: true
  },
  {
    type: '',
    name: 'NestedPropertyParent',
    value: '',
    items: [
      {
        type: 'TEXT',
        name: 'NestedTextProperty',
        value: ''
      },
    ]
  },
  {
    type: '',
    name: 'Protocol',
    value: '',
    items: [
      {
        type: 'TEXT',
        name: 'Protocol',
        value: 'SFTP'
      },
      {
        type: 'TEXT',
        name: 'Protocol',
        value: 'FTP'
      },
      {
        type: 'TEXT',
        name: 'Protocol',
        value: 'AS2'
      },
    ]
  },
];

const ActivitySchema = {
  contextData: ContextDataProperties,
  tasks: [
    {
      id: 'SPONSOR_TASK_1',
      name: 'sponsorTask1',
      type: 'SPONSOR_TASK',
      subTasks: [
        {
          id: 'DIALOG_TASK',
          type: 'DIALOG',
          name: 'captureConfiguration',
          jsonSchema: dialog1
        },
        {
          id: 'DIALOG_TASK',
          type: 'DIALOG',
          name: 'captureStatus',
          jsonSchema: dialog2
        },
        {
          id: 'DIALOG_TASK',
          type: 'DIALOG',
          name: 'captureStatusDynamic',
          jsonSchema: dialog3
        }
      ]
    }
  ]
};
/*
const contextDataMappingData = {
  items: [
    {
      name: 'sponsorTask1',
      type: 'SPONSOR_TASK',
      items: [
        {
          name: 'captureConfiguration',
          type: 'DIALOG',
          data: {
            test: {
              configurations: ''
            }
          }
        },
        {
          name: 'captureStatus',
          type: 'DIALOG',
          data: {
            test: {
              status: ''
            }
          }
        },
        {
          name: 'getUsers',
          type: 'API',
          data: {
            userList: []
          }
        }
      ]
    }
  ]
};

// $.items[?(@.name==="sponsorTask1")].items[?(@.name==="captureConfiguration")].data.test.configurations

const contextDataMappingSchema = {
  items: [
    {
      type: 'task',
      name: 'sponsorTask1',
      items: [
        {
          type: 'dialog',
          name: 'captureConfiguration',
          items: [
            {
              type: 'binding',
              name: 'test',
              items: [
                {
                  type: 'binding',
                  name: 'configurations'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};*/

export default ActivitySchema;

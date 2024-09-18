import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const API_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      isRequired: false,
      enableCounter: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    }
  ]
};

export const APPROVAL_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days) (required)',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Estimate is required'
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      name: 'reopenTask',
      labelText: 'Select Task to reopen up to when rejecting',
      options: [
        {
          label: 'Task 1',
          value: 'task-1'
        },
        {
          label: 'Task 2',
          value: 'task-2'
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      name: 'role',
      labelText: 'Role',
      options: [
        {
          label: 'AssignRole_Auto_Sponsor',
          value: 'AssignRole_Auto_Sponsor'
        },
        {
          label: 'AssignRole_Auto_Sponsor2',
          value: 'AssignRole_Auto_Sponsor2'
        },
        {
          label: 'Both',
          value: 'Both'
        },
        {
          label: 'Both1',
          value: 'Both1'
        },
        {
          label: 'Both441344',
          value: 'Both441344'
        },
        {
          label: 'BothRole1',
          value: 'BothRole1'
        },
        {
          label: 'BothRole2',
          value: 'BothRole2'
        }
      ]
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'send_to_approval',
      labelText: 'Send email when approved'
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'enable_approval',
      labelText: 'Enable auto approval warning'
    }
  ]
};

export const ATTRIBUTE_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description (optional)',
      isRequired: true,
      enableCounter: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      name: 'attributeType',
      labelText: 'Attribut Type',
      options: [
        {
          label: 'My Partners',
          value: 'my_partners'
        },
        {
          label: 'Request Type',
          value: 'request_type'
        },
        {
          label: 'SubResource Type',
          value: 'Sub_Resource_Type'
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      name: 'attributeValue',
      labelText: 'Attribute Value',
      options: [
        {
          label: 'My Partners',
          value: 'my_partners'
        },
        {
          label: 'Request Type',
          value: 'request_type'
        },
        {
          label: 'SubResource Type',
          value: 'Sub_Resource_Type'
        }
      ]
    }
  ]
};

export const CUSTOM_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    }
  ]
};

export const DIALOG_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      isRequired: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    }
  ]
};

export const PARTNER_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days)'
    },
    {
      component: componentTypes.SELECT,
      name: 'role',
      labelText: 'Role',
      options: [
        {
          label: 'Select Role',
          value: ''
        },
        {
          label: 'AssignRole_Auto_Sponsor',
          value: 'AssignRole_Auto_Sponsor'
        },
        {
          label: 'AssignRole_Auto_Sponsor2',
          value: 'AssignRole_Auto_Sponsor2'
        },
        {
          label: 'Both',
          value: 'Both'
        },
        {
          label: 'Both1',
          value: 'Both1'
        },
        {
          label: 'Both441344',
          value: 'Both441344'
        },
        {
          label: 'BothRole1',
          value: 'BothRole1'
        },
        {
          label: 'BothRole2',
          value: 'BothRole2'
        }
      ]
    }
  ]
};

export const SPONSOR_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      isRequired: true,
      enableCounter: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days)'
    },
    {
      component: componentTypes.SELECT,
      name: 'role',
      labelText: 'Role',
      options: [
        {
          label: 'AssignRole_Auto_Sponsor',
          value: 'AssignRole_Auto_Sponsor'
        },
        {
          label: 'AssignRole_Auto_Sponsor2',
          value: 'AssignRole_Auto_Sponsor2'
        },
        {
          label: 'Both',
          value: 'Both'
        },
        {
          label: 'Both1',
          value: 'Both1'
        },
        {
          label: 'Both441344',
          value: 'Both441344'
        },
        {
          label: 'BothRole1',
          value: 'BothRole1'
        },
        {
          label: 'BothRole2',
          value: 'BothRole2'
        }
      ]
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'show_to_partner',
      labelText: 'Show To Partner'
    }
  ]
};

export const SYSTEM_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    }
  ]
};

export const XSLT_FROM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[^&<>"'.{}]+$/i,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 100,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Description must be no longer then 100 characters'
        }
      ]
    }
  ]
};

export const ACTIVITY_TASK_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      'data-testid': 'activity-name',
      labelText: 'Name (required)',
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 100,
          message: 'Name must be no longer then 100 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      enableCounter: true,
      isRequired: false,
      maxCount: 80,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 80,
          message: 'Description must be no longer then 80 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'contextData',
      labelText: 'Context Data'
    }
    /*{
      component: componentTypes.CHECKBOX,
      name: 'encrypted',
      labelText: 'Encrypt'
    }*/
  ]
};

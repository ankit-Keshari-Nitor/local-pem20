import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const API_FORM_SCHEMA = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      labelText: 'Name (required)',
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days)',
      placeholder: 'Enter Days',
      validate: [
        {
          type: validatorTypes.PATTERN,
          pattern: /^[0-9]{1,3}$/g,
          message: 'Estimate days should not contain more then 3 digits'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days)',
      placeholder: 'Enter Days',
      validate: [
        {
          type: validatorTypes.PATTERN,
          pattern: /^[0-9]{1,3}$/g,
          message: 'Estimate days should not contain more then 3 digits'
        }
      ]
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'estimate_days',
      labelText: 'Estimate (Days)',
      placeholder: 'Enter Days',
      validate: [
        {
          type: validatorTypes.PATTERN,
          pattern: /^[0-9]{1,3}$/g,
          message: 'Estimate days should not contain more then 3 digits'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
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
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
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
      labelText: 'Name (required)',
      placeholder: 'Enter Name',
      helperText: 'Name should not contain &,<,>,",\',.,{,}, characters.',
      isRequired: true,
      maxCount: 30,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'Name is required'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9_-\s]+$/,
          message: 'Name should not contain &,<,>,",\',.,{,}, characters.'
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 30,
          message: 'Name must be no longer then 50 characters'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      labelText: 'Description',
      placeholder: 'Enter Description',
      enableCounter: true,
      isRequired: true,
      maxCount: 255,
      validate: [
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 255,
          message: 'Description must be no longer then 255 characters'
        },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[a-zA-Z0-9!@#$%^&*(){}|:;.'?,-=_/\s]+$/,
          message: 'Description should not contain <,> characters.'
        }
      ]
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'contextData',
      labelText: 'Context Data'
    }
  ]
};

import { defineParameterType } from '@cucumber/cucumber';
import { JSONPath } from 'jsonpath-plus';

const customParameterTypes = {};

const customDefineParameterType = function (parameterConfig) {
  defineParameterType(parameterConfig);
  customParameterTypes[parameterConfig.name] = parameterConfig;
};

const handleCustomParameterTypes = function (type, data) {
  if (customParameterTypes.hasOwnProperty(type)) {
    return customParameterTypes[type].transformer(data);
  }
  return data;
};
const registerTypesWithArray = (types) => {
  Object.entries(types).forEach(([name, typeArray]) =>
    customDefineParameterType({
      name: name,
      regexp: new RegExp(typeArray.filter((k) => !Number(k)).join('|')),
      transformer: (type) => {
        if (typeArray.indexOf(type) > -1) {
          return type;
        }
        throw new Error(`${name} can only be ${typeArray.filter((k) => !Number(k)).join('|')}`);
      }
    })
  );
};

const registerTypesWithObject = (types) => {
  Object.entries(types).forEach(([name, typeObject]) =>
    customDefineParameterType({
      name: name,
      regexp: new RegExp(Object.keys(typeObject).join('|')),
      transformer: (type) => {
        if (typeObject.hasOwnProperty(type)) {
          return { type: type, ...typeObject[type] };
        }
        throw new Error(`${name} can only be ${Object.keys(typeObject).join('|')}, but recieved ${type}`);
      }
    })
  );
};

registerTypesWithArray({
  elementStatus: 'enabled|disabled|visible|hidden|readOnly'.split('|'),
  notificationType: 'success|information|warning|error'.split('|')
});

registerTypesWithObject({
  appUser: {
    SYSTEM_ADMIN: {
      userId: 'fg_sysadmin',
      password: 'password'
    },
    DEFAULT_ORGANIZATION_ADMIN: {
      userId: 'admin',
      password: 'password'
    },
    ORGANIZATION_ADMIN: {
      userId: 'philmiller',
      password: 'Test@password'
    },
    ORGANIZATION_UNIT_ADMIN: {
      userId: 'ginacarpenter',
      password: 'Test@password'
    }
  },
  modalType: {
    confirm: {
      label: 'Confirm'
    },
    information: {
      label: 'Information'
    },
    warning: {
      label: 'Warning'
    },
    error: {
      label: 'Error'
    }
  },
  formFieldType: {
    TextInput: {
      label: 'label.cds--label',
      control: 'input[type="text"].cds--text-input',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    Password: {
      label: 'label.cds--label',
      control: 'input[type="password"].cds--text-input',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    NumberInput: {
      label: 'label.cds--label',
      control: 'input[type="number"]',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    Select: {
      label: 'label.cds--label',
      control: 'select.cds--select-input',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    RadioGroup: {
      label: 'legend.cds--label',
      control: '.cds--radio-button-wrapper',
      field: '.cds--form-item',
      message: '',
      options: ''
    },
    Radio: {
      label: 'label.cds--radio-button__label',
      control: 'input[type="text"].cds--text-input',
      field: '.cds--form-item',
      message: ''
    },
    CheckboxGroup: {
      label: 'legend.cds--label',
      control: '.cds--form-item',
      field: 'fieldset.cds--checkbox-group',
      message: '',
      options: ''
    },
    Checkbox: {
      label: 'label.cds--checkbox-label',
      control: 'input[type="checkbox"]',
      field: 'fieldset.cds--checkbox-group .cds--form-item',
      message: ''
    },
    Toggle: {
      label: 'label .cds--toggle__label-text',
      control: 'button[role="switch"]',
      field: '.cds--form-item.cds--toggle-wrapper',
      message: ''
    },
    Combobox: {
      label: 'label.cds--label',
      control: 'input[type="text"][role="combobox"].cds--text-input',
      field: '.cds--list-box__wrapper',
      message: '',
      option: '.cds--list-box__menu .cds--list-box__menu-item'
    },
    MultiSelect: {
      label: 'label.cds--label',
      control: 'input[role="combobox"].cds--text-input',
      field: '.cds--multi-select__wrapper',
      message: '',
      option: '.cds--list-box__menu .cds--list-box__menu-item'
    },
    FileInput: {
      label: 'label.cds--label',
      control: 'input[type="file"].cds--file-input',
      field: '.cds--form-item',
      fileName: '.cds--file__selected-file .cds--file-filename',
      message: 'div[id="<fieldId>-error-msg"]'
    },
    TextArea: {
      label: 'label.cds--label',
      control: 'textarea',
      field: '.cds--form-item',
      message: 'div[id="<fieldId>-error-msg"]'
    },
  }
});

customDefineParameterType({
  name: 'stringJsonPath',
  regexp: /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/,
  transformer: function (value) {
    if (value.indexOf('$') === 0) {
      const jsonPathValue = JSONPath({ path: value, json: this.excelData, wrap: false });
      return jsonPathValue;
    } else if (value.indexOf('#') === 0) {
      const jsonPathValue = JSONPath({ path: value.replace('#', '$'), json: this.po, wrap: false });
      return jsonPathValue;
    } else {
      return value;
    }
  }
});

export { customParameterTypes, handleCustomParameterTypes };

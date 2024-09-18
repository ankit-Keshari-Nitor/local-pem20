export const CONTEXT_MAPPING_TYPES = {
  CONSTANT: 'constant',
  SFTP_PUSH: 'SFTPIBPushProfileConfig',
  HEADER_LOGO: 'header_logo',
  ACTIVITY_FILE: 'activity_file'
};

export const CONTEXT_TYPES = {
  API_CONFIG: 'API_CONFIG',
  LOGO_FILE: 'LOGO_FILE',
  ACTIVITY_FILE: 'ACTIVITY_FILE',
  BOOLEAN: 'BOOLEAN',
  TEXT: 'TEXT'
};

export const ContextMappingOptions = {
  tasks: [
    {
      id: 'constant',
      type: CONTEXT_MAPPING_TYPES.CONSTANT,
      name: 'Constant'
    },
    {
      id: 'sponsor_server_info',
      type: 'sponsor_server_info',
      name: 'Sponsor Server Info',
      subTasks: [
        {
          id: 'SFTPIBPushProfileConfig',
          type: CONTEXT_TYPES.API_CONFIG,
          name: 'SFTPIBPushProfileConfig'
        }
      ]
    },
    {
      id: 'ui_cutomization',
      type: 'ui_cutomization',
      name: 'UI Cutomization',
      subTasks: [
        {
          id: 'header_logo',
          type: CONTEXT_TYPES.LOGO_FILE,
          name: 'Header logo'
        },
        {
          id: 'activity_file',
          type: CONTEXT_TYPES.ACTIVITY_FILE,
          name: 'Activity File'
        }
      ]
    }
  ]
};

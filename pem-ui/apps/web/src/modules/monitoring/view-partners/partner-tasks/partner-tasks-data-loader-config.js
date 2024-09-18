const DataLoaderConfig = {
  PARTNER_TASK: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: ''
      };
    }
  }
};

export default DataLoaderConfig;

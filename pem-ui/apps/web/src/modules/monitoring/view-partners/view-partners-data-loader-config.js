const DataLoaderConfig = {
  VIEWPARTNER: {
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

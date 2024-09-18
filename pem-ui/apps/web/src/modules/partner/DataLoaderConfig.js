import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  PARTNER: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        // url: getEnvironmentValue('USER.PERMISSIONTREE')
        url: '/rest/sponsors/b2b/partners',
        //url: '/pemws/sponsors/b2b/partners/',
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'partnerKey');
        }
      };
    }
  }
};

export default DataLoaderConfig;

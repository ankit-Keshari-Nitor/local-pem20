import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  SPONSOR: {
    USER: {
      LIST: ({ getEnvironmentValue }) => {
        return {
          type: 'RESTAPI',
          method: 'GET',
          url: '/rest/sponsors/hsbc/users/',
          handleUrl: (url, inpout, options) => {
            return '/rest/sponsors/hsbc/users/';
          },
          handleOutput: (responseData) => {
            ListAPIHandler.handleResponse(responseData, 'userKey');
          }
        };
      }
    }
  }
};

export default DataLoaderConfig;

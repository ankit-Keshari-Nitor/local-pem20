import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  FILE: {
    UPLOAD: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'POST',
        url: '/rest/sponsors/b2b/documents/upload'
      };
    },
    VIEW: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/b2b/vchdocuments',
        handleUrl: (url, input) => {
          return `${url}/${input.id}`;
        },
        handleOutput: (responseData) => {
          return responseData.data;
        }
      };
    },
    LISTLOGO: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: `/rest/sponsors/b2b/vchdocuments/?documentCategory=LOGO`,
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'documentKey');
        }
      };
    },
    LISTACTIVITY: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: `/rest/sponsors/b2b/vchdocuments/?documentCategory=ACTIVITY`,
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'documentKey');
        }
      };
    },
  }
};

export default DataLoaderConfig;

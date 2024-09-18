import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  FILE: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/:sponsorContext/vchdocuments/',
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'documentKey');
        }
      };
    },
    DETAILS: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/:sponsorContext/vchdocuments/',
        handleUrl: (url, input) => {
          return `${url}/${input.authorizedUserKey}`;
        },
        handleOutput: (responseData) => {
          responseData.data.id = responseData.data.authorizedUserKey;
        }
      };
    },
    UPLOAD: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'POST',
        url: '/rest/sponsors/:sponsorContext/documents/upload'
      };
    },
    DOWNLOAD: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/:sponsorContext/documents/download'
      };
    }
  }
};

export default DataLoaderConfig;

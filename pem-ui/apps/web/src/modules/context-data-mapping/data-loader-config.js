import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  API_CONFIGURATION: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/b2b/apiconfigurations/',
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'apiConfigurationKey');
        }
      };
    },
    VIEW: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/b2b/apiconfigurations',
        handleUrl: (url, input) => {
          return `${url}/${input.id}`;
        },
        handleOutput: (responseData) => {
          return responseData.data;
        }
      };
    },
    CREATE: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'POST',
        url: '/rest/sponsors/:sponsorContext/apiconfigurations/',
        handleInput: (input, options) => {
          delete input.authenticationType;
          delete input.sponsorContext;
          delete input.apiConfigurationKey;

          input.preemptiveAuth = input.preemptiveAuth ? 'TRUE' : 'FALSE';
          input.isInternalAuth = input.isInternalAuth ? 'TRUE' : 'FALSE';
          input.verifyHost = input.verifyHost ? 'TRUE' : 'FALSE';
        }
      };
    }
  },
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

    ACTIVITY_LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: `/rest/sponsors/b2b/vchdocuments/?documentCategory=ACTIVITY`,
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'documentKey');
        }
      };
    },
    LOGO_LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: `/rest/sponsors/b2b/vchdocuments/?documentCategory=LOGO`,
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'documentKey');
        }
      };
    },
    USERLIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: `/rest/sponsors/b2b/users/`,
        handleUrl: (url, input) => {
          return `${url}/${input.createdBy}`;
        },
        handleOutput: (responseData) => {
          return responseData.data.firstName
        }
      };
    }
  }
};

export default DataLoaderConfig;

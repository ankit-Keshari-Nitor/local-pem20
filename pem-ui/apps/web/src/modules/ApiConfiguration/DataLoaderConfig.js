import ListAPIHandler from '../../common/api-handler/list';

const DataLoaderConfig = {
  API_CONFIGURATION: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/:sponsorContext/apiconfigurations/',
        handleOutput: (responseData) => {
          ListAPIHandler.handleResponse(responseData, 'apiConfigurationKey');
        }
      };
    },
    DETAILS: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/rest/sponsors/:sponsorContext/apiconfigurations/',
        handleUrl: (url, input) => {
          return `${url}/${input.apiConfigurationKey}`;
        },
        handleOutput: (responseData) => {
          responseData.data.id = responseData.data.apiConfigurationKey;
          responseData.data.verifyHost = responseData.data.verifyHost.code === 'TRUE';
          responseData.data.isInternalAuth = responseData.data.isInternalAuth.code === 'TRUE';
          responseData.data.preemptiveAuth = responseData.data.preemptiveAuth.code === 'TRUE';
          responseData.data.authenticationType = responseData.data.isInternalAuth ? 'INTERNAL_TOKEN' : responseData.data.userName ? 'USERNAME_PASSWORD' : 'NONE';
        }
      };
    },
    ADD: ({ getEnvironmentValue }) => {
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
    },
    UPDATE: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'PUT',
        url: '/rest/sponsors/:sponsorContext/apiconfigurations/',
        handleUrl: (url, input) => {
          return `${url}/${input.apiConfigurationKey}`;
        },
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
  }
};

export default DataLoaderConfig;

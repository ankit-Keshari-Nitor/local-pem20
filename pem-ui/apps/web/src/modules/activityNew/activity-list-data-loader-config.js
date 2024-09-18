import { ListAPIHandlerNew } from '../../common/api-handler/list';
const DataLoaderConfig = {
  DEFINITION: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/sponsors/cashbank/v2/activityDefinitions?application=PEM',
        handleOutput: (responseData) => {
          ListAPIHandlerNew.handleResponse(responseData, 'activityDefnKey');
        }
      };
    },
    MARKASFINAL: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'POST',
        url: '/sponsors/cashbank/v2/activityDefinitions/:activityDefnKey/versions/:activityDefnVersionKey/actions/markAsFinal',
      };
    },
    DELETE: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'DELETE',
        url: '/sponsors/cashbank/v2/activityDefinitions/:activityDefnKey',
      };
    },
  },
  ACTIVITY_VERSION: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/sponsors/cashbank/v2/activityDefinitions/:activityDefnKey/versions',
        handleOutput: (responseData) => {
          ListAPIHandlerNew.handleResponse(responseData, 'activityDefnVersionKey');
        }
      };
    },
    MARKASDEFAULT: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'POST',
        url: '/sponsors/cashbank/v2/activityDefinitions/:activityDefnKey/versions/:activityDefnVersionKey/actions/markAsDefault',
      };
    },
  }
};

export default DataLoaderConfig;

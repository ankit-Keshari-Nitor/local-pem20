//import { mockRolloutData } from './mockData';

const DataLoaderConfig = {
  ROLLOUT_ACTIVITY: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/sponsors/cashbank/v2/activityDefinitions',
        handleOutput: (responseData) => {
          const customizedData =
            responseData.data.content !== null &&
            responseData.data.content.map((e) => ({
              id: e.activityDefnKey,
              activityDefnVersionKey: e.defaultVersion.activityDefnVersionKey,
              version: e.defaultVersion.version,
              isEncrypted: e.defaultVersion.isEncrypted,
              status: e.defaultVersion.status,
              ...e
            }));
          return (responseData.data = {
            _embedded: {
              data: customizedData || []
            },
            page: {
              end: 9,
              pageNumber: responseData.data?.pageContent?.number + 1 || 0,
              pageSize: responseData.data?.pageContent?.size || 0,
              start: 0,
              totalItems: responseData.data?.pageContent?.totalElements || 0
            }
          });
        }
      };
    }
  },
  PARTNERS_ACTIVITY: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/sponsors/cashbank/v2/activityDefinitions',
        handleOutput: (responseData) => {
          const customizedData =
            responseData.data.content !== null &&
            responseData.data.content.map((e) => ({
              id: e.activityDefnKey,
              activityDefnVersionKey: e.defaultVersion.activityDefnVersionKey,
              version: e.defaultVersion.version,
              isEncrypted: e.defaultVersion.isEncrypted,
              status: e.defaultVersion.status,
              ...e
            }));
          return (responseData.data = {
            _embedded: {
              data: customizedData || []
            },
            page: {
              end: 9,
              pageNumber: responseData.data?.pageContent?.number + 1 || 0,
              pageSize: responseData.data?.pageContent?.size || 0,
              start: 0,
              totalItems: responseData.data?.pageContent?.totalElements || 0
            }
          });
          //ListAPIHandler.handleResponse(responseData);
        }
      };
    }
  },
  INTERNAL_ACTIVITY: {
    LIST: ({ getEnvironmentValue }) => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: '/sponsors/cashbank/v2/activityDefinitions',
        handleOutput: (responseData) => {
          const customizedData =
            responseData.data.content !== null &&
            responseData.data.content.map((e) => ({
              id: e.activityDefnKey,
              activityDefnVersionKey: e.defaultVersion.activityDefnVersionKey,
              version: e.defaultVersion.version,
              isEncrypted: e.defaultVersion.isEncrypted,
              status: e.defaultVersion.status,
              ...e
            }));
          return (responseData.data = {
            _embedded: {
              data: customizedData || []
            },
            page: {
              end: 9,
              pageNumber: responseData.data?.pageContent?.number + 1 || 0,
              pageSize: responseData.data?.pageContent?.size || 0,
              start: 0,
              totalItems: responseData.data?.pageContent?.totalElements || 0
            }
          });
          //ListAPIHandler.handleResponse(responseData);
        }
      };
    }
  }
};

export default DataLoaderConfig;

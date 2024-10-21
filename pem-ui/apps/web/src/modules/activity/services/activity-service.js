import { API_END_POINTS, TEST_DIALOG_DATA, API_METHODS } from './../constants';
import { RestApiService } from '../../../common/api-handler/rest-api-service';
import Shell from '@b2bi/shell';

const generateOptions = (param = {}) => {
  const options = {
    headers: {
      Accept: 'application/json'
    },
    params: param
  };

  return options;
};


// Function to get the list of all activities
export const getActivityList = async (pageNo, pageSize, sortDir = 'ASC', searchKey = '', status = '', sortBy = 'modifyts') => {
  const url = `${API_END_POINTS.ACTIVITY_DEFINITION}`;
  let config = {
    url,
    params: {
      application: 'PEM',
      sortDir: sortDir,
      pageNo: pageNo,
      pageSize: pageSize,
      sortBy: sortBy,
      status: status,
      name: `con:${searchKey}`
    }
  };
  const response = await new RestApiService().call(config, null);
  
  if (response.success) {
    const customizedData = response.data.content.map((e) => ({
      id: e.activityDefnKey,
      activityDefnVersionKey: e.defaultVersion.activityDefnVersionKey,
      version: e.defaultVersion.version,
      isEncrypted: e.defaultVersion.isEncrypted,
      status: e.defaultVersion.status,
      ...e
    }));
    return {
      success: true,
      content: customizedData || [],
      pageContent: response.data.pageContent
    };
  } else {
    return {
      success: false,
      content: [],
      pageContent: {}
    };
  }
};

// Function to delete the activity
export const deleteActivity = async (activityDefnKey) => {
  let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}`;
  let config = {
    url,
    method: 'DELETE'
  };
  const response = await new RestApiService().call(config, null);

  return response.success;
};

// Function to mark the activity as final status
export const markActivityDefinitionAsFinal = async (activityDefnKey, activityDefnKeyVersion) => {
  let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions/${activityDefnKeyVersion}/actions/markAsFinal`;
  let config = {
    url,
    method: 'POST',
    data: ''
  };
  const response = await new RestApiService().call(config, null);

  return response.success && response?.data?.status !== undefined && response?.data?.status === 'FINAL';
};

// Function to get the details of activity
export const getActivityDetails = async (activityKey, activityVersoinKey) => {
  const url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityKey}`;
  const response = await new RestApiService().call({ url }, null);
  if (response.success) {
    const activityVersions = await new RestApiService().call({ url: `${url}/versions?&pageNo=0&pageSize=100` }, null);
    const activityCurrentVersionDetails = await new RestApiService().call({ url: `${url}/versions/${activityVersoinKey}` }, null);
    const activityCurrentVersionData = await new RestApiService().call({ url: `${url}/versions/${activityVersoinKey}/actions/getData` }, null);

    const activityData = {
      definition: {
        name: response.data.name,
        description: response.data.description,
        definationKey: response.data.activityDefnKey
      },
      version: {
        key: activityCurrentVersionDetails.data.activityDefnVersionKey,
        encrypted: activityCurrentVersionDetails.data.isEncrypted, //false,
        contextData: activityCurrentVersionData.data.process.contextData,
        status: activityCurrentVersionDetails.data.status,
        number: activityCurrentVersionDetails.data.version
      },
      schema: {
        nodes: activityCurrentVersionData.data.process.nodes,
        edges: activityCurrentVersionData.data.process.connectors
      }
    };

    return {
      success: true,
      activityData,
      versions: activityVersions.data.content
    };
  } else {
    return {
      success: false,
      activityData: null,
      versions: []
    };
  }
};

// Function to save the details of activity
export const saveActivityData = async (activityData) => {
  const url = `${API_END_POINTS.ACTIVITY_DEFINITION}`;
  const file = new Blob([JSON.stringify(activityData)], { type: 'text/json' });
  const config = {
    url,
    data: {
      name: activityData.name,
      description: activityData.description,
      application: 'PEM',
      file: file
    }
  };
  return await new RestApiService().callWithFile(config, null);
};

export const getActivityTestData = async () => {
  try {
    return await TEST_DIALOG_DATA;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

// Function to get the API Configuration List
export const getAPIConfiguration = async () => {
  let url = `${API_END_POINTS.API_CONFIGURATION}`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  return response.status === 200 ? response?.data : [];
}
import { API_END_POINTS } from './../constants';
import { RestApiService } from '../../../common/api-handler/rest-api-service';

export const getActivityVersionList = async (activityDefnKey, pageNo, pageSize, sortDir = 'DESC', sortBy = 'modifyTs', status = '') => {
  let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions`;

  let config = {
    url,
    params: {
      status: status,
      pageNo: pageNo,
      pageSize: pageSize,
      sortBy: sortBy,
      sortDir: sortDir
    }
  };

  const response = await new RestApiService().call(config, null);
  if (response.success) {
    const customizedData =
      response.data.content !== null &&
      response.data.content.map((e) => ({
        id: e.activityDefnVersionKey,
        ...e
      }));
    return {
      success: true,
      content: customizedData || [],
      pageContent: response?.data?.page
    };
  } else {
    return {
      success: false,
      content: [],
      pageContent: {}
    };
  }
};

export const markVersionAsDefault = async (activityDefnKey, activityDefnKeyVersion) => {
  let url = `${API_END_POINTS.ACTIVITY_DEFINITION}/${activityDefnKey}/versions/${activityDefnKeyVersion}/actions/markAsDefault`;

  let config = {
    url,
    method: 'POST',
    data: ''
  };
  const response = await new RestApiService().call(config, null);

  return response.success;
};

export const updateActivityVersion = async (activityData, activityDefnKey, versionkey) => {
  const activityUpdateResponse = await new RestApiService().call(
    {
      url: `/sponsors/cashbank/v2/activityDefinitions/${activityDefnKey}`,
      method: 'POST',
      data: {
        name: activityData.name,
        description: activityData.description
      }
    },
    null
  );

  if (activityUpdateResponse.success) {
    const file = new Blob([JSON.stringify(activityData)], { type: 'application/json' });
    const config = {
      url: `/sponsors/cashbank/v2/activityDefinitions/${activityDefnKey}/versions/${versionkey}`,
      data: {
        //name: activityData.name,
        description: activityData.description,
        isEncrypted: false,
        //application: 'PEM',
        file: file
      }
    };
    return await new RestApiService().callWithFile(config, null);
  } else return activityUpdateResponse;
};

// Function to save the details of version
export const createActivityVersion = async (activityData, activityDefnKey) => {
  const file = new Blob([JSON.stringify(activityData)], { type: 'text/json' });
  const config = {
    url: `/sponsors/cashbank/v2/activityDefinitions/${activityDefnKey}/versions`,
    data: {
      description: activityData.description,
      isEncrypted: false,
      application: 'PEM',
      file: file
    }
  };
  return await new RestApiService().callWithFile(config, null);
};

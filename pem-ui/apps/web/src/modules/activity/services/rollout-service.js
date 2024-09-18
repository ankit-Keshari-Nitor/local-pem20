import Shell from '@b2bi/shell';
import { API_METHODS, API_END_POINTS } from '../constants';

const generateOptions = (param = {}) => {
  const options = {
    headers: {
      Accept: 'application/json'
    },
    params: param
  };

  return options;
};

// Function to get the Attribute Type List
export const getAttributeTypeList = async () => {
  let url = `${API_END_POINTS.ATTRIBUTE_TYPES}`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  return response.status === 200 ? response?.data : [];
};

// Function to get the Attributes List
export const getAttributeList = async (selectedAttributeType, searchKey) => {
  let url = `${API_END_POINTS.ATTRIBUTE_LIST}/${selectedAttributeType}/attributeValues`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  return response.status === 200 ? response?.data : [];
};

// Function to get the Partners List
export const getPartnerList = async (param) => {
  let url = `${API_END_POINTS.PARTNERS_LIST}`;

  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions(param));
  return response.status === 200 ? response?.data : [];
};

// Function to get the Partners Users List
export const getPartnerUserList = async (param, partnerId) => {
  let url = `${API_END_POINTS.PARTNERS_LIST}${partnerId}/users/`;

  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions(param));
  return response.status === 200 ? response?.data : [];
};

// Function to get the Group List
export const getGroupList = async (selectedAttributeType) => {
  let url = `${API_END_POINTS.ATTRIBUTE_TYPES}`;
  let dataLoaderConfig = { url, method: API_METHODS.GET };

  const response = await new Shell.RestApiService().call(dataLoaderConfig, null, generateOptions());
  return response.status === 200 ? response?.data : [];
};

// Function to rollout Activity
export const rolloutActivity = async (activityDefnVersionKey, rolloutData, rolloutPartnersData) => {
  let partnersData = [];
  let attributeValuesData = [];
  let attributeGroupsData = [];
  if (rolloutPartnersData.selectedPartnersData.length > 0) {
    partnersData = rolloutPartnersData.selectedPartnersData.map((item) => {
      return { partnerKey: item.partnerKey, contextDataNodes: [] };
    });
  }

  if (rolloutPartnersData.selectedAttributesData.length > 0) {
    attributeValuesData = rolloutPartnersData.selectedAttributesData.map((item) => {
      return {
        attributeValueKey: item.attributeValueKey
      };
    });
  }

  if (rolloutPartnersData.selectedGroupsData.length > 0) {
    attributeGroupsData = rolloutPartnersData.selectedGroupsData.map((item) => {
      return {
        attributeGroupKey: item.value
      };
    });
  }

  let url = `${API_END_POINTS.ACTIVITY_DEFINITION_ROLLOUT}`;
  let dataLoaderConfig = { url, method: API_METHODS.POST };
  let data = {
    activityDefnVersionKey: activityDefnVersionKey,
    name: rolloutData.name,
    description: rolloutData.description,
    alertStartDate: rolloutData.alertDate,
    alertInterval: rolloutData.alertInterval,
    dueDate: rolloutData.dueDate,
    partners: partnersData,
    contextData: rolloutData.contextData,
    rolloutInternally: rolloutData.rollingOutTo === 'internal_users' ? true : false,
    attributeValues: attributeValuesData,
    attributeGroups: attributeGroupsData
  };
  const response = await new Shell.RestApiService().call(dataLoaderConfig, data, generateOptions());
  return response.status === 201 ? true : false;
};

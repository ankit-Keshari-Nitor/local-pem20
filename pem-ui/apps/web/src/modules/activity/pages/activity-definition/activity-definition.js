/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import Designer from '@b2bi/flow-designer';
import './activity-definition.scss';
import useActivityStore from '../../store';
import { getActivityDetails, saveActivityData, getAPIConfiguration, getRoles } from '../../services/activity-service';
import { updateActivityVersion } from '../../services/actvity-version-service';
import * as ActivityService from '../../services/activity-service.js';
import { OPERATIONS } from '../../constants';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Header,
  Link,
  SkipToContent,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Theme,
  IconButton,
  Modal
} from '@carbon/react';
import { saveAs } from 'file-saver';
import { PageNumber, Play, TrashCan, Copy, RecentlyViewed, ChevronLeft, CircleSolid } from '@carbon/icons-react';
import Notification from '../../helpers/wrapper-notification-toast';
import Shell from '@b2bi/shell';
import { generateNodeEdgesForApi, generateActivitySchema } from '../../util';

export default function ActivityDefinition() {
  const store = useActivityStore();
  const pageUtil = Shell.PageUtil();

  const activityObj = useActivityStore((state) => state.activityData);
  const currentActivity = useActivityStore((state) => state.selectedActivity);
  const updateActivitySchema = useActivityStore((state) => state.updateActivitySchema);
  const updateActivityDetails = useActivityStore((state) => state.updateActivityDetails);
  const updateActivityData = useActivityStore((state) => state.updateActivityData);

  const [notificationProps, setNotificationProps] = useState(null);
  const [showActivityDefineDrawer, setShowActivityDefineDrawer] = useState(true);

  const [activityDefinitionData, setActivityDefinitionData] = useState();
  const [activityVersions, setActivityVersions] = useState([]);

  const [loading, setLoading] = useState(false);

  const readOnly = currentActivity?.operation === OPERATIONS.VIEW ? true : false;
  const [activityStatistics, setActivityStatistics] = useState();
  const [activityBreadcrumbs, setActivityBreadcrumbs] = useState([]);
  const [activityDesignerStack, setActivityDesignerStack] = useState([]);

  const [isDialogFlowActive, setIsDialogFlowActive] = useState(false);
  const [isPageDesignerActive, setIsPageDesignerActive] = useState(false);

  const [openTaskPropertiesBlock, setOpenTaskPropertiesBlock] = useState();
  const [openDialogPropertiesBlock, setOpenDialogPropertiesBlock] = useState(false);

  const [openDeleteActivityModal, setOpenDeleteActivityModal] = useState(false);
  // -------------------------------- Node Deletion -------------------------------------------
  const [isSaveActivity, setIsSaveActivity] = useState(false);

  const nodeDataRefActivity = useRef();

  useEffect(() => {
    const getActivityData = (activityDefKey, versionKey) => {
      setLoading(true);
      getActivityDetails(activityDefKey, versionKey).then((response) => {
        setLoading(false);
        if (response.success) {
          const { nodes, edges } = generateActivitySchema(response.activityData.schema.nodes, response.activityData.schema.edges, readOnly);
          response.activityData.schema.nodes = nodes;
          response.activityData.schema.edges = edges;
          response.activityData.definition.contextData = response.activityData?.version?.contextData;
          setActivityDefinitionData(response.activityData);

          updateActivityData(response.activityData);
          setActivityVersions(response.versions);
        } else {
          console.log('error in api call');
        }
      });
    };
    if (currentActivity && currentActivity.activityDefKey && currentActivity.activityDefKey.length > 0) {
      getActivityData(store.selectedActivity.activityDefKey, store.selectedActivity.actDefVerKey);
    }
    return () => {
      //store.reset();
    };
  }, [currentActivity, updateActivityData, readOnly]);

  useEffect(() => {
    if (store.activityData) {
      setActivityDefinitionData(store.activityData);
      setActivityDesignerStack((prevValue) => {
        return [
          //...prevValue,
          {
            type: 'ACTIVITY',
            label: activityObj.definition.name,
            pathname: activityObj.definition.id,
            id: activityObj.definition.id
          }
        ];
      });
    }
  }, []);

  useEffect(() => {
    if (store.activityData?.definition) {
      setActivityDesignerStack(() => {
        return [
          {
            type: 'ACTIVITY',
            label: activityObj.definition.name,
            pathname: activityObj.definition.id,
            id: activityObj.definition.id
          }
        ];
      });
    }
  }, [activityObj.definition.name]);

  useEffect(() => {
    setActivityBreadcrumbs(
      activityDesignerStack.map((item) => {
        return {
          id: item.id,
          breadcrumbLabel: item.label,
          pathname: item.pathname
        };
      })
    );
    setOpenDialogPropertiesBlock(false);
    setOpenTaskPropertiesBlock(false);
  }, [activityDesignerStack, setActivityBreadcrumbs]);

  const onVersionSelection = (selectedVersionObj) => {
    store.setSelectedActivity({
      ...currentActivity,
      actDefVerKey: selectedVersionObj.activityDefnVersionKey,
      actDefStatus: selectedVersionObj.status,
      status: selectedVersionObj.status,
      version: `Ver. ${selectedVersionObj.version}`
    });
  };

  const activityDetailsSave = (activity) => {
    updateActivityDetails(activity);
    const newActivity = {
      schema: activityObj.schema,
      definition: activity.definition,
      version: activity.version
    };
    setActivityDefinitionData(newActivity);
  };

  const saveActivity = async () => {
    if (activityObj.definition.name && activityObj.definition.name.trim().length === 0) {
      setNotificationProps({
        open: true,
        title: 'Validation',
        subtitle: 'Activity Name is required',
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
      setShowActivityDefineDrawer(true);
      return;
    }
    if (!isSaveActivity) {
      setNotificationProps({
        open: true,
        title: 'Validation',
        subtitle: 'At least connector should be their in each node',
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
      setShowActivityDefineDrawer(true);
      return;
    }

    const nodeEdgesData = generateNodeEdgesForApi(activityObj.schema.nodes, activityObj.schema.edges, [], false);
    if (nodeEdgesData.error.length > 0) {
      setNotificationProps({
        open: true,
        title: 'Error-' + nodeEdgesData.error[0].error,
        subtitle: nodeEdgesData.error[0].error,
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
      return;
    }
    // Final New Activity Data
    const finalNewActivityData = {
      name: activityObj.definition.name,
      description: activityObj.definition.description,
      schemaVersion: activityObj.version.number,
      process: {
        nodes: nodeEdgesData.nodes,
        connectors: nodeEdgesData.edges, // connector for task flow designer
        contextData: activityObj.definition.contextData ? activityObj.definition.contextData : activityObj.version.contextData
      }
    };
    const file = new Blob([JSON.stringify(finalNewActivityData)], { type: 'application/json' });
    saveAs(file, `${finalNewActivityData.name}.json`);

    const saveResponse =
      store.selectedActivity && store.selectedActivity.actDefVerKey
        ? await updateActivityVersion(finalNewActivityData, store.selectedActivity.activityDefKey, store.selectedActivity.actDefVerKey)
        : await saveActivityData(finalNewActivityData);

    setNotificationProps({
      open: true,
      title: saveResponse.success ? 'Success - ' : 'Error - ',
      subtitle: saveResponse.success
        ? 'Activity Saved successfully!'
        : saveResponse.data.response.data.errorCode === 'DuplicateEntry'
          ? saveResponse.data.response.data.message
          : `Activity Save failed`,
      kind: saveResponse.success ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });

    if (saveResponse.success) {
      store.reset();
      setTimeout(() => {
        pageUtil.navigate('/activities/definitions', {});
      }, 2000);
    } else {
      console.log(saveResponse);
    }
  };

  const getNodeTypesCount = (nodes) => {
    const counts =
      nodes !== undefined &&
      nodes?.reduce(
        (acc, node) => {
          acc[node.type] = (acc[node.type] || 0) + 1;
          return acc;
        },
        {
          FORM: 0,
          API: 0,
          XSLT: 0
        }
      );

    const labels = {
      FORM: 'Form',
      API: 'API',
      XSLT: 'XSLT'
    };

    return Object.keys(counts).map((type) => ({
      type,
      label: labels[type],
      count: counts[type]
    }));
  };

  const countExcludedNodes = {
    START: true,
    END: true,
    BRANCH_START: true,
    BRANCH_END: true
  };

  useEffect(() => {
    if (activityDesignerStack.length === 1) {
      if (activityObj?.schema?.nodes) {
        const taskCount = activityObj.schema.nodes.filter((node) => !countExcludedNodes[node.type]).length;
        setActivityStatistics(
          <>
            <div className="activity-task-count">
              <CircleSolid className={`node-type-task`}></CircleSolid> <span className="activity-task-name">Tasks ({taskCount})</span>
            </div>
          </>
        );
      }
    } else if (activityDesignerStack.length >= 2) {
      if (activityObj?.schema?.nodes) {
        const currentNode = activityObj.schema.nodes.find((node) => node.id === activityDesignerStack[1].id);

        setActivityStatistics(
          getNodeTypesCount(currentNode?.data?.dialogNodes.filter((node) => !countExcludedNodes[node.type])).map((countItem) => (
            <>
              <div className="activity-task-count">
                <CircleSolid className={`node-type-${countItem.type.toLowerCase()}`}></CircleSolid>{' '}
                <span className="activity-task-name">
                  {countItem.label} ({countItem.count})
                </span>
              </div>
            </>
          ))
        );
      }
    }
  }, [activityObj, activityDesignerStack]);

  //API Configuration List Call
  const getApiConfiguration = async () => {
    try {
      const apiConfig = await getAPIConfiguration(); // Ensure this is awaited if it's a promise
      return apiConfig;
    } catch (error) {
      console.error('Error fetching API configuration:', error);
    }
  };

  //Activity List Call
  const getDocumentFile = async (key) => {
    try {
      const activityList = await ActivityService.getDocumentFile(key); // Ensure this is awaited if it's a promise
      // const data = await ActivityService.getDocuments(key)
      return activityList;
    } catch (error) {
      console.error('Error fetching API configuration:', error);
    }
  };

  //Document Base64 call
  const getDocuments = async (key) => {
    try {
      const base64doc = await ActivityService.getDocuments(key); // Ensure this is awaited if it's a promise
      return base64doc;
    } catch (error) {
      console.error('Error fetching API configuration:', error);
    }
  };

  //Roles List Call
  const getRoleList = async () => {
    try {
      const roleList = await getRoles();
      return roleList;
    } catch (error) {
      console.error('Error fetching Role list:', error);
    }
  };

  const handleBreadcrumbClick = (event) => {
    if (event.currentTarget.getAttribute('id') === '1' && activityDesignerStack.length > 2) {
      setIsDialogFlowActive(true);
      setIsPageDesignerActive(false);
      setActivityDesignerStack((prevValue) => {
        return prevValue.slice(0, -1);
      });
    } else if (event.currentTarget.getAttribute('id') === '0' && activityDesignerStack.length >= 1) {
      nodeDataRefActivity.current = { ...nodeDataRefActivity.current, state: true };
      setIsDialogFlowActive(false);
      setIsPageDesignerActive(false);
      if (activityDesignerStack.length === 3) {
        setActivityDesignerStack((prevValue) => {
          return prevValue.slice(0, -2);
        });
      } else if (activityDesignerStack.length === 1) {
        // setOpenTaskPropertiesBlock(false);
        // setShowActivityDefineDrawer(true);
      } else {
        setActivityDesignerStack((prevValue) => {
          return prevValue.slice(0, -1);
        });
      }
    }
  };

  const handleActivityDetailClick = () => {
    setOpenTaskPropertiesBlock(false);
    setOpenDialogPropertiesBlock(false);
    setShowActivityDefineDrawer(true);
  };

  // Handler for actual delete API call
  const handleDeleteActivity = async (id) => {
    const response = await ActivityService.deleteActivity(id);
    if (response) {
      store.reset();
      setTimeout(() => {
        pageUtil.navigate('/activities/definitions', {});
      }, 2000);
    }
    setNotificationProps({
      open: true,
      title: response ? 'Success - ' : 'Error - ',
      subtitle: response ? 'Action completed successfully!' : 'Action not completed successfully!',
      kind: response ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
  };

  return (
    <>
      {/* Workflow Designer Header */}
      <Theme theme="g100">
        <Header aria-label="Activity Definition" className="activity-definition-header">
          <SkipToContent />
          <HeaderMenuButton />
          <HeaderName prefix="">
            <IconButton
              label="Back"
              size="md"
              kind="ghost"
              align="bottom"
              onClick={(event) => {
                event.stopPropagation();
                pageUtil.navigate(-1);
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Breadcrumb noTrailingSlash data-testid="breadcrumb">
              {activityBreadcrumbs.map(({ breadcrumbLabel, pathname }, index, items) => {
                return (
                  <BreadcrumbItem id={index} key={pathname} isCurrentPage={index === items.length - 1} onClick={handleBreadcrumbClick}>
                    <Link to={pathname}>{breadcrumbLabel}</Link>
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
          </HeaderName>
          <div className="activity-task-section">{activityStatistics}</div>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Activity Details" onClick={handleActivityDetailClick}>
              <PageNumber size={16} />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Preview" disabled>
              <Play size={16} />
            </HeaderGlobalAction>
            {store.selectedActivity.activityDefKey !== '' && (
              <HeaderGlobalAction aria-label="Delete" onClick={() => setOpenDeleteActivityModal(true)}>
                <TrashCan size={16} />
              </HeaderGlobalAction>
            )}

            <HeaderGlobalAction aria-label="Clone" disabled>
              <IconButton label="Copy" size="md" kind="ghost" align="bottom-right">
                <Copy size={16} />
              </IconButton>
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="History" disabled>
              <RecentlyViewed size={16} />
            </HeaderGlobalAction>
            <HeaderGlobalAction className="user-profile">
              <Button id="saveactivity" size="sm" onClick={() => saveActivity()} disabled={activityObj.definition.name.trim().length === 0}>
                Save Activity
              </Button>
            </HeaderGlobalAction>
            <HeaderGlobalAction className="user-profile"></HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>
      </Theme>
      {/* Workflow Designer Canvas */}
      {loading
        ? 'Loading...'
        : activityDefinitionData && (
            <Designer.WorkFlowDesigner
              showActivityDefineDrawer={showActivityDefineDrawer}
              setShowActivityDefineDrawer={setShowActivityDefineDrawer}
              setActivityDesignerStack={setActivityDesignerStack}
              updateActivityDetails={activityDetailsSave}
              updateActivitySchema={updateActivitySchema}
              activityDefinitionData={activityDefinitionData}
              activityOperation={store.selectedActivity ? store.selectedActivity.operation : 'New'}
              readOnly={readOnly}
              onVersionSelection={(selectedVersion) => onVersionSelection(selectedVersion)}
              versionData={activityVersions} //todo -- this data will be based on version api response
              selectedVersion={store.selectedActivity ? store.selectedActivity.version : 1} //todo - pass current version id being loaded
              setNotificationProps={setNotificationProps} // to show the success notification
              getApiConfiguration={getApiConfiguration} //to call the API Configuration
              getDocumentFile={getDocumentFile} //to call document data
              getDocuments={getDocuments} //to call base64 for the document
              getRoleList={getRoleList} // to call Role List
              isDialogFlowActive={isDialogFlowActive}
              setIsDialogFlowActive={setIsDialogFlowActive}
              isPageDesignerActive={isPageDesignerActive}
              setIsPageDesignerActive={setIsPageDesignerActive}
              openTaskPropertiesBlock={openTaskPropertiesBlock}
              setOpenTaskPropertiesBlock={setOpenTaskPropertiesBlock}
              openDialogPropertiesBlock={openDialogPropertiesBlock}
              setOpenDialogPropertiesBlock={setOpenDialogPropertiesBlock}
              nodeDataRefActivity={nodeDataRefActivity}
              setIsSaveActivity={setIsSaveActivity}
            />
          )}
      {notificationProps && notificationProps.open && <Notification {...notificationProps} />}
      <Modal
        open={openDeleteActivityModal}
        onRequestClose={() => setOpenDeleteActivityModal(false)}
        onRequestSubmit={() => {
          handleDeleteActivity(store.selectedActivity.activityDefKey);
        }}
        isFullWidth
        modalHeading="Confirmation"
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
      >
        <p
          style={{
            padding: '0px 0px 1rem 1rem'
          }}
        >
          {'Are you sure you want to delete? The Activity status will be changed to Deleted.'}
        </p>
      </Modal>
    </>
  );
}

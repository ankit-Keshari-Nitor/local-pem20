import React, { useState, useEffect, useCallback } from 'react';
import './activity-list.scss';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';
import * as ActivityService from '../../services/activity-service.js';

import { ACTIVITY_LIST_COLUMNS, ACTION_COLUMN_KEYS } from '../../constants';
import { ExpandableSearch, MultiSelect, Button } from '@carbon/react';
import { NewTab, Add } from '@carbon/icons-react';

import GeneralModal from '../../helpers/wrapper-modal';
import WrapperNotification from '../../helpers/wrapper-notification-toast';

import useActivityStore from '../../store';

import ActivityRolloutModal from '../../components/rollout-wizard';
import ActivityTestModal from '../../components/test-wizard';

import ActivityVersionList from '../activity-version-list/activity-version-list.js';
import ActivityVersionsSideDrawer from '../../components/activity-sidedrawer/activity-sidedrawer.js';

import ActivityDataTableComponent from '../../components/datatable-component/index.js';

export default function ActivityList() {
  const pageUtil = Shell.PageUtil();

  // State hooks for managing various states
  const store = useActivityStore();

  const [totalRows, setTotalRows] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [sortDir, setSortDir] = useState('DESC'); // Sorting direction state
  const [sortBy, setSortBy] = useState('modifyTs'); // Sorting direction state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');

  const [showRolloutModal, setShowRolloutModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const [showGeneralActionModal, setShowGeneralActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState('');
  const [onPrimaryButtonClick, setOnPrimaryButtonClick] = useState(null); // Renamed state

  const [notificationProps, setNotificationProps] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const [activityName, setActivityName] = useState('');
  const [activityDefnKey, setActivityDefnKey] = useState('');
  const [activityStatus, setActivityStatus] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);

  // Function to fetch and set data from the API
  const fetchAndSetData = useCallback(() => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, searchKey, status, sortBy)
      .then((data) => {
        setRows(data.content);
        setTotalRows(data.pageContent.totalElements);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        setNotificationProps({
          open: true,
          title: 'Error - ',
          subtitle: 'Failed to fetch data',
          kind: 'error',
          onCloseButtonClick: () => setNotificationProps(null)
        });
      });
  }, [pageNo, pageSize, sortDir, status, searchKey, sortBy]);

  // useEffect to trigger fetchAndSetData whenever dependencies change
  useEffect(() => {
    fetchAndSetData();
  }, [fetchAndSetData]);

  // Handler for sorting table columns
  const handleHeaderClick = (headerKey) => {
    if (headerKey === 'name') {
      setSortBy('activityName');
      setSortDir((prevSortDir) => (prevSortDir === 'ASC' ? 'DESC' : 'ASC'));
    }
  };
  // Handler for changing filter selection
  const handleFilterChange = (selectedItems) => {
    if (Array.isArray(selectedItems.selectedItems)) {
      const selectedIds = selectedItems.selectedItems.map((item) => item.id);
      setStatus(selectedIds.join(','));
    } else {
      setStatus([]);
    }
  };
  // Handler for pagination changes
  const handlePaginationChange = (page, pageSize) => {
    setPageNo(page);
    setPageSize(pageSize);
  };

  // Handler for action clicks
  const onCellActionClick = (action, activityDefKey, actVersionKey = '') => {
    const record = rows.filter((x) => x.id === activityDefKey)[0];
    store.setSelectedActivity({
      activityDefKey: record.activityDefnKey,
      actDefName: record.name,
      actDefVerKey: record.activityDefnVersionKey,
      operation: action,
      status: record.status,
      version: record.version
    });
    setSelectedActivity(record);
    switch (action) {
      case ACTION_COLUMN_KEYS.MARK_AS_FINAL:
        setActionText('Mark as final');
        setMessage('The Activity can not be modified once you Mark as final. Do you want to Mark as final?');
        setOnPrimaryButtonClick(() => () => handleMarkAsFinal(activityDefKey, actVersionKey)); // Updated
        setShowGeneralActionModal(true);

        break;
      case ACTION_COLUMN_KEYS.DELETE:
        setActionText('Delete');
        setMessage('Are you sure you want to delete? The Activity status will be changed to Deleted.');
        setOnPrimaryButtonClick(() => () => handleDeleteActivity(activityDefKey));
        setShowGeneralActionModal(true);
        break;
      case ACTION_COLUMN_KEYS.ROLLOUT:
        setShowRolloutModal(true); //(id);
        break;
      case ACTION_COLUMN_KEYS.TEST_ACTIVITY:
        setShowTestModal(true);
        break;
      case ACTION_COLUMN_KEYS.EDIT:
        handleEdit(activityDefKey);
        break;
      case ACTION_COLUMN_KEYS.VIEW:
        handleView(activityDefKey);
        break;
      case ACTION_COLUMN_KEYS.EXPORT_ACTIVITY:
        console.log('Export Activity');
        break;
      case ACTION_COLUMN_KEYS.CLONE_ACTIVITY:
        console.log('Clone Activity');
        break;
      case ACTION_COLUMN_KEYS.RESTORE:
        console.log('Restore Activity');
        break;
      default:
        return;
    }
  };

  // Handler for marking activity as final
  const handleMarkAsFinal = async (id, versionKey) => {
    const response = await ActivityService.markActivityDefinitionAsFinal(id, versionKey);

    if (response) {
      fetchAndSetData();
    }
    setNotificationProps({
      open: true,
      title: response ? 'Success - ' : 'Error - ',
      subtitle: response ? 'Action completed successfully!' : `Action not completed successfully!`,
      kind: response ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    setShowGeneralActionModal(false);
  };

  // Handler for actual delete API call
  const handleDeleteActivity = async (id) => {
    const response = await ActivityService.deleteActivity(id);
    if (response) {
      fetchAndSetData();
    }
    setNotificationProps({
      open: true,
      title: response ? 'Success - ' : 'Error - ',
      subtitle: response ? 'Action completed successfully!' : 'Action not completed successfully!',
      kind: response ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    setShowGeneralActionModal(false);
  };

  const handleEdit = (id) => {
    pageUtil.navigate(`${id}`, {});
  };

  const handleView = (id) => {
    pageUtil.navigate(`${id}`, {});
  };

  const onNewClick = () => {
    store.reset();
    pageUtil.navigate('new', {});
  };

  const handleVersion = (id, activityName, status) => {
    setActivityDefnKey(id);
    setActivityName(activityName);
    setActivityStatus(status);
    setShowDrawer(true);
  };

  const handleClose = () => {
    setShowDrawer(false);
    fetchAndSetData();
  };

  return (
    <>
      <div className="headers">
        <div className="header-button-right">
          {/* Header Title */}
          {pageUtil.t('mod-activity-definition:list.title')}
        </div>
        <div className="header-button-left">
          {/* Search, New, Import buttons */}
          <ExpandableSearch labelText="Search" placeholder="Search By Activity Name" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
          <Button size="sm" className="new-button" renderIcon={NewTab} onClick={onNewClick}>
            New
          </Button>
          <Button size="sm" kind="tertiary" className="import-button" renderIcon={Add}>
            Import
          </Button>
          {/* Filter dropdown */}
          <MultiSelect
            className="filter-dropdown"
            id="filter-dropdown"
            titleText=""
            label="Filter Option"
            items={[
              { id: 'DRAFT', text: 'DRAFT' },
              { id: 'FINAL', text: 'FINAL' },
              { id: 'DELETE', text: 'DELETE' }
            ]}
            itemToString={(item) => (item ? item.text : '')}
            onChange={handleFilterChange} // Ensure this is correctly set to your onChange handler
          />
        </div>
      </div>
      <ActivityDataTableComponent
        name="activity-list"
        headers={ACTIVITY_LIST_COLUMNS}
        rows={rows}
        sortDir={sortDir}
        totalRows={totalRows}
        pageNo={pageNo}
        pageSize={pageSize}
        handlePaginationChange={handlePaginationChange}
        onCellActionClick={onCellActionClick}
        handleHeaderClick={handleHeaderClick}
        handleVersion={handleVersion}
      />
      {/* For Version Drawer */}
      {activityDefnKey !== '' && (
        <div className="activity-sidedrawer-drawer">
          <ActivityVersionsSideDrawer anchor="right" showDrawer={showDrawer} onClose={handleClose}>
            <ActivityVersionList activityName={activityName} onClose={handleClose} activityDefnKey={activityDefnKey} status={activityStatus} showDrawer={showDrawer} />
          </ActivityVersionsSideDrawer>
        </div>
      )}
      {/* For Version Drawer */}
      {/*  </Section> */}
      {/* Modal for action confirmation */}
      <GeneralModal
        isOpen={showGeneralActionModal}
        setIsOpen={setShowGeneralActionModal}
        modalHeading="Confirmation"
        secondaryButtonText="Cancel"
        primaryButtonText={actionText}
        onPrimaryButtonClick={onPrimaryButtonClick}
        onSecondaryButtonClick={() => setShowGeneralActionModal(false)}
        onRequestClose={() => setShowGeneralActionModal(false)}
      >
        {message}
      </GeneralModal>
      {/* Modal for Test operation */}
      {showTestModal && (
        <ActivityTestModal showTestModal={showTestModal} setShowTestModal={() => setShowTestModal(false)} activityName={selectedActivity ? selectedActivity.name : ''} />
      )}

      {/* Notification toast */}
      {notificationProps && notificationProps.open && <WrapperNotification {...notificationProps} />}

      {/* Modal for Rollout operation */}
      {showRolloutModal && (
        <ActivityRolloutModal
          showModal={showRolloutModal}
          setShowModal={() => setShowRolloutModal(false)}
          activityDefnKey={selectedActivity ? selectedActivity.activityDefnKey : ''}
          activityDefnVersionKey={selectedActivity ? selectedActivity.activityDefnVersionKey : ''}
          activityName={selectedActivity ? selectedActivity.name : ''}
          reloadActivityList={fetchAndSetData}
        />
      )}
    </>
  );
}

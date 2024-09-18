/* eslint-disable react-hooks/exhaustive-deps*/
import React, { useState, useEffect, useCallback } from 'react';
import GeneralModal from '../../helpers/wrapper-modal';

import RolloutPartnersDetails from './components/rollout-partners-details';
import RolloutDetails from './components/rollout-details';
import * as RolloutService from '../../services/rollout-service';
import { DUMMY_CONTEXT_DATA } from '../../constants';
import WrapperNotification from './../../helpers/wrapper-notification-toast';

const ActivityRolloutModal = (props) => {
  const { showModal, setShowModal, activityName, activityDefnVersionKey, reloadActivityList } = props;
  const [notificationProps, setNotificationProps] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [rolloutPartnersData, setRolloutPartnersData] = useState({ selectedGroupsData: [], selectedAttributesData: [], selectedPartnersData: [] });
  const [rolloutDetails, setRolloutDetails] = useState({
    name: '',
    description: '',
    dueDate: new Date(),
    alertDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    alertInterval: 1,
    rollingOutTo: 'internal_users',
    partnersDetails: '',
    contextData: DUMMY_CONTEXT_DATA
  });

  // State to control the hide class
  const [hideClass, setHideClass] = useState(false);


  // Final Submit
  const finalRolloutSubmit = useCallback(() => {
    RolloutService.rolloutActivity(activityDefnVersionKey, rolloutDetails, rolloutPartnersData)
      .then((response) => {
        setNotificationProps({
          open: true,
          title: response ? 'Success - ' : 'Error - ',
          subtitle: response ? 'Action completed successfully!' : `Action not completed successfully!`,
          kind: response ? 'success' : 'error',
          onCloseButtonClick: () => setNotificationProps(null)
        });
        reloadActivityList();
        setShowModal(false);
      })
      .catch((errors) => {
        console.error('Failed to fetch data:', errors);
      });
  }, [activityDefnVersionKey, rolloutDetails, rolloutPartnersData, reloadActivityList]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && submitting) {
      finalRolloutSubmit();
    }
  }, [formErrors, finalRolloutSubmit, submitting]);

  useEffect(() => {
    if (rolloutDetails.name.length > 0) {
      setFormErrors((prev) => ({ ...prev, name: false }));
    }

    if (Number(rolloutDetails.alertInterval) >= 1 && Number(rolloutDetails.alertInterval) <= 99) {
      setFormErrors((prev) => ({ ...prev, alertInterval: false }));
    }

    if (rolloutDetails.rollingOutTo === 'partners') {
      let rolloutPartnersDataLength =
        rolloutPartnersData.selectedGroupsData.length + rolloutPartnersData.selectedAttributesData.length + rolloutPartnersData.selectedPartnersData.length;
      if (rolloutPartnersDataLength > 0) {
        setFormErrors((prev) => ({ ...prev, partnersDetails: false }));
      }
    }
  }, [rolloutDetails, rolloutPartnersData]);

  const validateValues = (inputValues) => {
    let errors = {};
    if (inputValues.name.length === 0) {
      errors.name = true;
    }

    if (!(Number(inputValues.alertInterval) >= 1 && Number(inputValues.alertInterval) <= 99)) {
      errors.alertInterval = true;
    }

    if (rolloutDetails.rollingOutTo === 'partners') {
      let rolloutPartnersDataLength =
        rolloutPartnersData.selectedGroupsData.length + rolloutPartnersData.selectedAttributesData.length + rolloutPartnersData.selectedPartnersData.length;
      if (rolloutPartnersDataLength === 0) {
        errors.partnersDetails = true;
      }
    }
    return errors;
  };

  const handleRolloutSubmit = (event) => {
    event.preventDefault();
    setFormErrors(validateValues(rolloutDetails));
    setSubmitting(true);
  };

  // Function to handle the Next/rollout Button Click
  const handleBackToDetails = () => {
    setOpenAddModal(false);
  };

  const handleAddGroups = (selectedGroupsData) => {
    setRolloutPartnersData((prev) => ({ ...prev, selectedGroupsData: [...selectedGroupsData] }));
  };

  const handleAddAttributes = (selectedAttributesData) => {
    setRolloutPartnersData((prev) => ({ ...prev, selectedAttributesData: [...selectedAttributesData] }));
  };

  const handleAddPartners = (selectedPartnersData) => {
    setRolloutPartnersData((prev) => ({ ...prev, selectedPartnersData: [...selectedPartnersData] }));
  };

  const handleRemovePartners = (selectedPartnersData) => {
    let partnersData = rolloutPartnersData.selectedPartnersData;
    let data = partnersData.filter((item) => !selectedPartnersData.includes(item.partnerUniqueId));
    setRolloutPartnersData((prev) => ({ ...prev, selectedPartnersData: [...data] }));
  };

  // Function to handle the context mapping action
  const handleContextMapping = (val) => {
    setHideClass(val);  // Set the class to hide
  };

  return (
    <>
      <span id="rollout" className={hideClass ? 'hideRollout' : 'showRollout'}>
        <GeneralModal
          isOpen={showModal}
          modalLabel={`Activity Rollout -${activityName}`}
          modalHeading={openAddModal ? 'Adding Partners' : 'Details'}
          secondaryButtonText={openAddModal ? 'Back to Details' : 'Cancel'}
          primaryButtonText={openAddModal ? 'Save' : 'Rollout'}
          onPrimaryButtonClick={handleRolloutSubmit}
          onSecondaryButtonClick={() => (openAddModal ? handleBackToDetails() : setShowModal(false))}
          onRequestClose={() => setShowModal(false)}
        >
          {openAddModal ? (
            <RolloutPartnersDetails
              handleAddGroups={handleAddGroups}
              handleAddAttributes={handleAddAttributes}
              handleAddPartners={handleAddPartners}
              handleRemovePartners={handleRemovePartners}
              rolloutPartnersData={rolloutPartnersData}
            />
          ) : (
            <RolloutDetails
              {...props}
              rolloutDetails={rolloutDetails}
              setRolloutDetails={setRolloutDetails}
              handleAddClick={() => setOpenAddModal(true)}
              formErrors={formErrors}
              handleRemovePartners={handleRemovePartners}
              rolloutPartnersData={rolloutPartnersData}
              onContextMapping={handleContextMapping} // Pass the handler down
            />
          )}
        </GeneralModal>
      </span>
      {/* Notification toast */}
      {notificationProps && notificationProps.open && <WrapperNotification {...notificationProps} />}
    </>
  );
};

export default ActivityRolloutModal;

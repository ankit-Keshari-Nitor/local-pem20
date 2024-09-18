import React, { useEffect, useState } from 'react';
import TestWizard from './test-wizard';
import * as ActivityService from '../../services/activity-service';
import GeneralModal from '../../helpers/wrapper-modal';
import PageDesigner from '@b2bi/page-designer';

const ActivityTestModal = (props) => {
  const { setShowTestModal, showTestModal, activityName } = props;

  // Test operation states
  const [currentTestStep, setCurrentTestStep] = useState(0);
  const [testDialogData, setTestDialogData] = useState([]);
  const [currentTestData, setCurrentTestData] = useState(null);
  const [formRenderSchema, setFormRenderSchema] = useState([]);

  useEffect(() => {
    getTestData();
  }, []);

  const getTestData = () => {
    ActivityService.getActivityTestData().then((data) => {
      setTestDialogData([...data]);
      setCurrentTestStep(0);
      setCurrentTestData(data && data[0]);
    });
  };

  useEffect(() => {
    if (testDialogData.length > 0) {
      let data = testDialogData[currentTestStep].schema.fields;
      setFormRenderSchema([...data]);
    }
  }, [currentTestData, currentTestStep, testDialogData]);

  // Function to handle the Next/rollout Button Click
  const handelTestFinishClick = () => {
    let schema = JSON.parse(JSON.stringify(formRenderSchema));
    schema = PageDesigner.formValidation(schema);
    setFormRenderSchema(schema);

    if (currentTestStep < testDialogData.length - 1) {
      setCurrentTestData(testDialogData[currentTestStep + 1]);
      setCurrentTestStep(currentTestStep + 1);
    } else if (currentTestStep === testDialogData.length - 1) {
      setShowTestModal(false);
    }
  };
  // Function to handle the Cancel/Previous Button Click
  const handelTestCloseClick = () => {
    if (currentTestStep === 0) {
      setShowTestModal(false);
    } else if (currentTestStep > 0 && currentTestStep <= testDialogData.length - 1) {
      setCurrentTestData(testDialogData[currentTestStep - 1]);
      setCurrentTestStep(currentTestStep - 1);
    }
  };

  return (
    <>
      {testDialogData.length > 0 && formRenderSchema.length > 0 && (
        <GeneralModal
          isOpen={showTestModal}
          setIsOpen={setShowTestModal}
          modalHeading={activityName}
          secondaryButtonText={currentTestStep === 0 ? 'Cancel' : 'Previous'}
          primaryButtonText={currentTestStep < testDialogData.length - 1 ? 'Next' : 'Finish'}
          onPrimaryButtonClick={handelTestFinishClick}
          onSecondaryButtonClick={handelTestCloseClick}
          onRequestClose={() => setShowTestModal(false)}
        >
          <TestWizard currentTestData={currentTestData} formRenderSchema={formRenderSchema} />
        </GeneralModal>
      )}
    </>
  );
};

export default ActivityTestModal;

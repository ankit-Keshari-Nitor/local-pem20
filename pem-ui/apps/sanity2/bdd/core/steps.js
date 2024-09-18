import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
// setDefaultTimeout(5000*60*2);
const stepRegistry = {};

const registerStep = function (stepName, optionsOrStepFn, stepFn) {
  stepRegistry[stepName] = { optionsOrStepFn, stepFn };
};

const callStep = function (world, stepName, stepArgs) {
  const step = stepRegistry[stepName];
  if (step.stepFn) {
    step.stepFn.apply(world, stepArgs);
  } else {
    step.optionsOrStepFn.apply(world, stepArgs);
  }
};

const CustomGiven = function (...args) {
  Given(...args);
  registerStep(...args);
};

const CustomWhen = function (...args) {
  When(...args);
  registerStep(...args);
};

const CustomThen = function (...args) {
  Then(...args);
  registerStep(...args);
};

//export { CustomGiven as Given, CustomWhen as When, CustomThen as Then, callStep };
export { Given, When, Then, callStep };

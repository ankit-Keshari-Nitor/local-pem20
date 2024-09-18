import { Given, When, Then } from '@cucumber/cucumber';
import { getModal } from '../page-objects/modal.po.js';

Then('User verifies [{modalType}] modal with message {string} is [{elementStatus}] [Modal]', async function (modalType, message, elementStatus) {
  const modal = getModal(this.page);
  await modal.verifyModalMessage(modalType, message, elementStatus);
});

When('User clicks on {string} action in [{modalType}][Modal]', async function (action, modalType) {
  const modal = getModal(this.page);
  await modal.performModalMessageAction(modalType, action);
});

Then('User verifies modal page with title {string} is [{elementStatus}] [Modal][{string}]', async function (title, elementStatus, modalId) {
  const modal = getModal(this.page);
  await modal.verifyModalPage(modalId, title, elementStatus);
});

When('User clicks on {string} action in [Modal][{string}]', async function (action, modalId) {
  const modal = getModal(this.page);
  await modal.performModalPageAction(modalId, action);
});

When('User clicks on {string} button in [Modal][{string}]', async function (action, modalId) {
  const modal = getModal(this.page);
  await modal.performModalButtonAction(modalId, action);
});

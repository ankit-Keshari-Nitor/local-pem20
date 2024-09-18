import { expect } from '@playwright/test';
import checkElementStatus from './ElementStatus.js';

class Modal {
  constructor(page) {
    this.page = page;
  }

  async verifyModalMessage(modalType, message, elementStatus) {
    const modal = await this.page.locator(`.cds--modal-container[aria-label="${modalType.label}"]`);
    if (elementStatus === 'visible') {
      await expect(modal).toBeVisible();
      const heading = await this.page.locator(`.cds--modal-container[aria-label="${modalType.label}"] .cds--modal-header__heading`);
      await expect(heading).toBeVisible();
      const messageStr = await heading.textContent();
      await expect(messageStr).toContain(message);
    } else if (elementStatus === 'hidden') {
      expect(modal).toBeHidden();
    }
  }

  async performModalMessageAction(modalType, action) {
    const modalFooter = await this.page.locator(`.cds--modal-container[aria-label="${modalType.label}"]  .cds--modal-footer`);
    await expect(modalFooter).toBeVisible();
    const actionBtn = await modalFooter.getByRole('button', { name: action });
    await expect(actionBtn).toBeVisible();
    await actionBtn.click();
  }

  async verifyModalPage(modalName, modalTitle, elementStatus) {
    const modal = await this.page.locator(`.cds--modal .page-content[name="${modalName}"]`);
    if (elementStatus === 'visible') {
      // expect(modal).toBeVisible();
      const heading = await modal.locator(`.cds--modal-header__heading`);
      await expect(heading).toBeVisible();
      const messageStr = await heading.textContent();
      await expect(messageStr).toBe(modalTitle);
    } else if (elementStatus === 'hidden') {
      await expect(modal).toBeHidden();
    }
  }

  async performModalPageAction(modalName, action) {
    const modal = await this.page.locator(`.cds--modal .page-content[name="${modalName}"]`);
    const modalFooter = await modal.locator(`.cds--modal-footer`);
    await expect(modalFooter).toBeVisible();
    const actionBtn = await modalFooter.getByRole('button', { name: action });
    await expect(actionBtn).toBeVisible();
    await actionBtn.click();
  }

  async performModalButtonAction(modalName, action) {
    const modal = await this.page.locator(`.cds--modal .page-content[name="${modalName}"]`);
    expect(modal).toBeVisible();
    const actionBtn = await modal.getByRole('button', { name: action });
    await expect(actionBtn).toBeVisible();
    await actionBtn.click();
  }
}

const getModal = function (parent) {
  return new Modal(parent);
};

export default Modal;

export { getModal };

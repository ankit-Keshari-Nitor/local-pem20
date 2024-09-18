import { expect } from '@playwright/test';

const role = {
  success: 'status',
  error: 'alert',
  warning: 'alert',
  info: 'log'
};

const title = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information'
};

class Notification {
  constructor(page) {
    this.page = page;
  }

  async verifyNotificationMessage(type, notificationType, message, elementStatus) {
    if (type === 'banner') {
      const notification = await this.page.locator(`[role=status].sfg--page-notification.cds--inline-notification--${notificationType}`);
      if (elementStatus === 'visible') {
        await expect(notification).toBeVisible();
        const subtitle = await notification.locator(`.cds--inline-notification__text-wrapper`);
        await expect(subtitle).toBeVisible();
        const messageStr = await subtitle.textContent();
        await expect(messageStr).toContain(message);
      } else if (elementStatus === 'hidden') {
        await expect(notification).toBeHidden();
      }
    } else if (type === 'toast') {
      const notification = await this.page.locator(`[role=${role[notificationType]}].cds--toast-notification--${notificationType}`);
      if (elementStatus === 'visible') {
        await expect(notification).toBeVisible();
        const subtitle = await notification.locator(`.cds--toast-notification__subtitle`);
        await expect(subtitle).toBeVisible();
        const messageStr = await subtitle.textContent();
        await expect(messageStr).toContain(message);
      } else if (elementStatus === 'hidden') {
        await expect(notification).toBeHidden();
      }
    }
  }

  async performNotificationAction(type, action) {
    if (type === 'banner') {
      const notificationAction = await this.page.locator(`[role=status].sfg--page-notification .cds--inline-notification__${action}-button`);
      await expect(notificationAction).toBeVisible();
      await notificationAction.click();
    } else if (type === 'toast') {
      const notificationAction = await this.page.locator(`.cds--toast-notification .cds--toast-notification__close-button`);
      await expect(notificationAction).toBeVisible();
      await notificationAction.click();
    }
  }
}

const getNotification = function (parent) {
  return new Notification(parent);
};

export default Notification;

export { getNotification };

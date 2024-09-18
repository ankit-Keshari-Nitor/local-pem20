import { expect } from '@playwright/test';

const checkElementStatus = async (element, status) => {
  if (status === 'enabled') {
    return await expect(element).toBeEnabled();
  } else if (status === 'disabled') {
    return await expect(element).toBeDisabled();
  } else if (status === 'visible') {
    return await expect(element).toBeVisible();
  } else if (status === 'hidden') {
    return await expect(element).toBeHidden();
  } else if (status === 'readonly') {
    return await expect(element).not.toBeEditable();
  }
};

export default checkElementStatus;

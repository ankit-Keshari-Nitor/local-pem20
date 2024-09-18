import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('User verifies {string} page is displayed [Page][{string}]', async function (pageTitle, pageId) {
  const textEle = await this.page
    .locator(`.sfg--page--${pageId} .page-header-container .cds--data-table-header__title`)
    .filter({
      hasText: pageTitle
    })
    .first();
  await expect(textEle).toBeVisible();
  const text = await textEle.textContent();
  await expect(text).toBe(pageTitle);
});

When('User clicks on {string} action in [Page][{string}]', async function (actionId, pageId) {
  const pageFooter = await this.page.locator(`.sfg--page--${pageId} .sfg--page--actions`);
  await expect(pageFooter).toBeVisible();
  const actionBtn = await pageFooter.getByRole('button', { name: actionId });
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();
});

When('User clicks on {string} button in [Page][{string}]', async function (actionId, pageId) {
  const page = await this.page.locator(`.sfg--page--${pageId}`);
  await expect(page).toBeVisible();
  const actionBtn = await page.locator(`button[name='${actionId}']`); // await page.getByRole('button', { name: actionId });
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();
});

Then('User verifies {string} image is visible [Page][{string}]', async function (actionId, pageId) {
  const page = await this.page.locator(`.sfg--page--${pageId}`);
  await expect(page).toBeVisible();
  const actionBtn = await page.locator(`button[name=${actionId}]`);
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();
});

Then('User switches the context to {string} organization [Page][{string}]', async function (tileName, pageId) {
  const orgTileSwitch = await this.page
    .locator(`.sfg--page--${pageId} .tile-group .tile-group-item`)
    .filter({ has: await this.page.locator(`.sfg--tile-header >> text=${tileName}`) });
  await expect(orgTileSwitch).toBeVisible();
  const orgTileSwitchBtn = orgTileSwitch.locator('.cds--tile .tile-actions .tile-action');
  await orgTileSwitchBtn.click();
});

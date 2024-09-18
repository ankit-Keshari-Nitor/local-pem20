import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import ParameterizedDataTable from '../support_files/ParameterizedDataTable.js';

When('User navigates to {string} under {string} [App-Nav]', async function (secondaryNav, primaryNav) {
  await this.page.locator('.cds--header__menu-bar li a').filter({ hasText: primaryNav }).click();
  // await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
  await this.page
    .locator('.cds--side-nav__item a .cds--side-nav__link-text')
    .filter({ hasText: new RegExp(`^${secondaryNav}$`) })
    .click();
  await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
});

Then('User verifies navigation item with label {string} is [{elementStatus}] under {string} [App-Nav]', async function (elementTitle, elementStatus, primaryNav) {
  await this.page.locator('.cds--header__menu-bar li a').filter({ hasText: primaryNav }).click();
  const navBarItem = await this.page.locator('.cds--side-nav__item a .cds--side-nav__link-text').filter({ hasText: elementTitle });
  if (elementStatus === 'visible') expect(navBarItem).toBeVisible();
  else expect(navBarItem).toBeDisabled();
});

Then('User verifies navigation items under {string} in [App-Nav]', async function (primaryNav, dataTable) {
  // TODO: Need to check the step for the nested items
  await this.page.locator('.cds--header__menu-bar li a').filter({ hasText: primaryNav }).click();
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|elementStatus');
  const data = transformedDataTable.transformedHashes();
  for (let i = 0; i < data.length; i++) {
    const navItemName = data[i];
    const navBarVisible = await this.page.locator('.cds--side-nav__item a .cds--side-nav__link-text').filter({ hasText: navItemName.name });
    if (navItemName.elementStatus === 'visible') expect(navBarVisible).toBeVisible();
    else expect(navBarVisible).toBeDisabled();
  }
});

Then('User clicks on {string} under [User-Nav]', async function (rightNav) {
  const profileMenu = await this.page.locator('.cds--header__global .cds--popover-container').nth(1);
  expect(profileMenu).toBeVisible();
  await profileMenu.click();
  const switchOrgTab = await this.page.locator('.cds--header .cds--header-panel .cds--switcher .cds--switcher__item').filter({ hasText: rightNav });
  expect(switchOrgTab).toBeVisible();
  await switchOrgTab.click();
});

Then('User verifies items under [User-Nav]', async function (dataTable) {
  const profileMenu = await this.page.locator('.cds--header__global .cds--popover-container').nth(1);
  expect(profileMenu).toBeVisible();
  await profileMenu.click();
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|elementStatus');
  const data = transformedDataTable.transformedHashes();
  for (let i = 0; i < data.length; i++) {
    const userItemName = data[i];
    const userItemVisible = await this.page.locator('.cds--switcher .cds--switcher__item').filter({ hasText: userItemName.name });
    if (userItemName.elementStatus === 'visible') expect(userItemVisible).toBeVisible();
    else expect(userItemVisible).toBeDisabled();
  }
});

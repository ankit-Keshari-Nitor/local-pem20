import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('User clicks on {string} tab [Tab][{string}]', async function (tabId, tabSetId) {
  const tab = await this.page.locator(`.cds--tab--list [role=tab][name="${tabId}"]`)//.filter({ hasText: tabId}); //
  await tab.click();
});

Then('User verifies {string} tab is selected [Tab][{string}]', async function (tabId, tabSetId) {
  const tab = await this.page.locator(`.cds--tab--list [role=tab][name="${tabId}"]`)//.filter({ hasText: tabId}); //
  expect(tab).toHaveAttribute('aria-selected', 'true');
  expect(await tab.getAttribute('class')).toContain('cds--tabs__nav-item--selected');
  const tabpanel = await this.page.locator(`.cds--tab-content[role=tabpanel][name="${tabId}"]`);
  expect(tabpanel).toBeVisible();
});

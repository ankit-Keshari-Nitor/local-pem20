import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('User verifies Tile {string} is visible in [Tile][{string}]', async function (tileId, tileName) {
const tile = await this.page.locator(`div#${tileId}`);

  expect(tile).toBeVisible();
 
});

import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { chromium, firefox, webkit, request } from '@playwright/test';

let browser;

BeforeAll(async function () {
  /*switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }*/
  // setDefaultTimeout(30 * 1000);
  browser = await chromium.launch({ headless: false });
});

Before(async function ({ pickle }) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: { dir: 'screenshots', size: { width: 1600, height: 900 } }, // recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1600, height: 900 }
  });
  /*this.server = await request.newContext({
      // All requests we send go to this API endpoint.
      baseURL: config.BASE_API_URL,
    });*/

  //await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  
  /*this.page.on('console', async (msg: ConsoleMessage) => {
      if (msg.type() === 'log') {
        await this.attach(msg.text());
      }
    });*/
  this.feature = pickle;
});

BeforeStep(async function (scenario) {
  // This hook will be executed before all steps, and take a screenshot on step prestate
  //if (scenario.result.status === Status.FAILED) {
    //await takeScreenShot.bind(this)(scenario.pickleStep.name);
  // }
  // await takeScreenShot.bind(this)(scenario.pickleStep.name, "BeforeStep");
});

AfterStep( async function (scenario) {
  // This hook will be executed after all steps, and take a screenshot on step failure
  if (scenario.result.status === Status.FAILED) {
    await takeScreenShot.bind(this)(scenario.pickleStep.name, "AfterStepFailure");
  }
  // await takeScreenShot.bind(this)(scenario.pickleStep.name, "AfterStep");
});

After(async function (scenario) {
  await this.page.waitForTimeout(10);
  if (scenario.result) {
    await this.attach(`Status: ${scenario.result?.status}. Duration:${scenario.result.duration?.seconds}s`);

    if (scenario.result.status !== Status.PASSED) {
      // const image = await this.page?.screenshot();

      // Replace : with _ because colons aren't allowed in Windows paths
      //const timePart = this.startTime?.toISOString().split('.')[0].replaceAll(':', '_');

      //image && (await this.attach(image, 'image/png'));
      //await this.context?.tracing.stop({
      //  path: `${tracesDir}/${this.testName}-${timePart}trace.zip`
      //});
      await takeScreenShot.bind(this)(scenario.pickle.name, "AfterScenario");
      const path = await this.page.video().path();
      attachVedio.bind(this)(path, "failureVedio");
      // this.attach(path,{fileName: "vediopath"})
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});

const takeScreenShot = async function (fileName, type) {
  const screenShotPath = './playwright/reports/screenshots/';
  const screensShotExtn = '.png';
  const screenShot = await this.page?.screenshot({
    path: screenShotPath + fileName + screensShotExtn,
    fullPage: true
  });
  if (screenShot) await this.attach(screenShot, { mediaType: 'image/png', fileName: type});
};


const attachVedio = async function(vediopath, type) {
  const videoEmbedCode = `<video width="640" height="480" controls><source src="${vediopath}" type="video/webm">Your browser does not support the video tag.</video>`;

  // Attach the video embed code to the Cucumber report
  this.attach(videoEmbedCode, { mediaType: 'text/html', fileName: type, url: videoEmbedCode} );
}
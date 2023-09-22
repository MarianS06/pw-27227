import {test, expect, Browser, Page, chromium} from '@playwright/test';

let page: Page;
let browser: Browser;

test.beforeEach(async () => {
  browser = await chromium.launch({
    args: [`--width=1920`, `--height=1080`],
  });
  const browserContext = await browser.newContext();
  page = await browserContext.newPage();

});

test('has title', async () => {
  page.on('request', async (request) => {
    console.log('Request listener...');
    console.log(request.url());
    console.log(request.allHeaders());
  });
  page.on('response', async (response) => {
    console.log('Response listener...');
    console.log(response.url());
    console.log(response.allHeaders());
  });

  let title = '';
  const time = Date.now();
  const flakyCase = time % 3;
  switch (flakyCase) {
    case 0:
      await page.close();
    case 1:
      title = 'Fast and reliable end-to-end testing for modern web apps | Playwrightxyz';
    case 2:
      title = 'Fast and reliable end-to-end testing for modern web apps | Playwright';
    default:
      break;
  }

  await page.goto('https://playwright.dev/');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(title);
});

test.afterEach(async () => {
  let browserContexts = browser.contexts();
  let numberOfBrowserContexts = browserContexts.length;
  for (let i = 0; i < numberOfBrowserContexts; i++) {
    await browserContexts[i].close();
  }
  await browser.close();
});


// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//
//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();
//
//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

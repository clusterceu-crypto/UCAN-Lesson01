const { test, expect } = require('@playwright/test');

test('Lesson 01 loads without browser or local resource errors', async ({
  page,
}) => {
  const baseURL = 'http://127.0.0.1:41731';
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const badResponses = [];
  const isLocalURL = (url) => url.startsWith(baseURL);

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('requestfailed', (request) => {
    if (isLocalURL(request.url())) {
      failedRequests.push(
        `${request.method()} ${request.url()}: ${
          request.failure()?.errorText || 'unknown request failure'
        }`,
      );
    }
  });

  page.on('response', (response) => {
    if (isLocalURL(response.url()) && response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  const response = await page.goto('/index.html', {
    waitUntil: 'load',
  });

  expect(response, 'index.html did not return a response').not.toBeNull();
  expect(response.ok(), `index.html returned HTTP ${response.status()}`).toBe(
    true,
  );
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/Заняття 01/);

  expect(
    await page.locator('link[rel="stylesheet"][href]').count(),
    'No stylesheet reference was found',
  ).toBeGreaterThan(0);
  expect(
    await page.locator('script[src]').count(),
    'No script reference was found',
  ).toBeGreaterThan(0);
  expect(
    await page.locator('img[src], source[src], source[srcset]').count(),
    'No image or source reference was found',
  ).toBeGreaterThan(0);

  expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
  expect(pageErrors, pageErrors.join('\n')).toEqual([]);
  expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  expect(badResponses, badResponses.join('\n')).toEqual([]);
});

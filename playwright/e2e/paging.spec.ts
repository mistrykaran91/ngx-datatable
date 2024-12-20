import { Page } from '@playwright/test';
import { expect, test } from '../support/test-helpers';

test.describe('paging', () => {
  test.describe('client-side', () => {
    const example = 'client-paging';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);
      await pagerTest(page, 10);

      await si.runVisualAndA11yTests('client-side-paging');

      // await si.runVisualAndA11yTests('virtual-server-scrolling', [
      //   {
      //     id: 'label',
      //     enabled: false
      //   },
      //   {
      //     id: 'empty-table-header',
      //     enabled: false
      //   },
      //   {
      //     id: 'aria-progressbar-name',
      //     enabled: false
      //   },
      //   {
      //     id: 'aria-required-children',
      //     enabled: false
      //   }
      // ]);
    });
  });

  test.describe('server-side', () => {
    const example = 'server-paging';

    test(example, async ({ si, page }) => {
      await si.visitExample(example, false);

      await page.waitForSelector('datatable-row-wrapper');
      await pagerTest(page, 20);
      await expect(page.locator('.empty-row')).not.toBeVisible();
      await page.waitForSelector('span[title="Tonya Bray"]');
      await expect(page.getByRole('cell', { name: 'Ethel Price' })).not.toBeVisible();
      await si.runVisualAndA11yTests('server-side-paging');
    });
  });

  test.describe('paging scrolling with no virtulization', () => {
    const example = 'paging-scrolling-novirtualization';

    test(example, async ({ si, page }) => {
      await si.visitExample(example, false);

      await expect(page.locator('ghost-loader')).toBeVisible();
      await page.waitForSelector('datatable-row-wrapper');
      await pagerTest(page, 20);
      await page.waitForSelector('span[title="Tonya Bray"]');
      await expect(page.locator('ghost-loader').first()).not.toBeVisible();
      await expect(page.getByRole('cell', { name: 'Ethel Price' })).not.toBeVisible();
      await si.runVisualAndA11yTests('paging-scrolling-novirtualization');
    });
  });

  test.describe('server scrolling', () => {
    const example = 'server-scrolling';

    test(example, async ({ si, page }) => {
      await si.visitExample(example, false);

      await expect(page.locator('ghost-loader')).toBeVisible();
      await expect(page.locator('.bar')).toBeVisible();

      await page.waitForSelector('datatable-scroller');

      const pager = page.locator('datatable-pager');
      expect(pager).not.toBeVisible();

      await expect(page.locator('ghost-loader')).not.toBeVisible();
      await expect(page.locator('.bar')).not.toBeVisible();

      await si.runVisualAndA11yTests('server-scrolling-initial', [
        {
          id: 'label',
          enabled: false
        },
        {
          id: 'empty-table-header',
          enabled: false
        },
        {
          id: 'aria-progressbar-name',
          enabled: false
        },
        {
          id: 'aria-required-children',
          enabled: false
        }
      ]);

      await page.getByRole('row', { name: 'Sarah Massey' }).click();

      await page.mouse.wheel(0, 1000);

      await expect(page.locator('ghost-loader').first()).toBeVisible();
      await expect(page.locator('.bar')).toBeVisible();

      await si.runVisualAndA11yTests('server-scrolling-after-scroll', [
        {
          id: 'aria-progressbar-name',
          enabled: false
        },
        {
          id: 'aria-required-children',
          enabled: false
        }
      ]);
    });
  });

  test.describe('virtual server side paging', () => {
    const example = 'virtual-paging';

    test(example + ' paginator test', async ({ si, page }) => {
      await si.visitExample(example, false);

      const pager = page.locator('datatable-pager');
      expect(pager).toBeTruthy();

      const firstPageButton = page.getByLabel('go to first page').locator('..');
      const previousButton = page.getByLabel('go to previous page').locator('..');
      const nextButton = page.getByLabel('go to next page').locator('..');
      const lastButton = page.getByLabel('go to last page').locator('..');

      await expect(firstPageButton).toHaveClass(/disabled/);
      await expect(previousButton).toHaveClass(/disabled/);
      await expect(nextButton).not.toHaveClass(/disabled/);
      await expect(lastButton).not.toHaveClass(/disabled/);

      await expect(page.getByRole('cell', { name: 'Ethel Price' })).toBeVisible();

      await lastButton.click();

      await expect(page.locator('ghost-loader').first()).toBeVisible();
      await expect(page.locator('.custom-loading-content')).toBeVisible();

      await expect(firstPageButton).not.toHaveClass(/disabled/);
      await expect(previousButton).not.toHaveClass(/disabled/);
      await expect(nextButton).toHaveClass(/disabled/);
      await expect(lastButton).toHaveClass(/disabled/);

      await page.waitForSelector('span[title="Humphrey Curtis"]');

      await expect(page.locator('ghost-loader').first()).not.toBeVisible();
      await expect(page.locator('.custom-loading-content')).not.toBeVisible();

      await expect(page.getByRole('cell', { name: 'Ethel Price' })).not.toBeVisible();
      await si.runVisualAndA11yTests('virtual-paging-server-paginator');
    });

    test(example, async ({ si, page }) => {
      await si.visitExample(example, false);

      await expect(page.locator('ghost-loader')).toBeVisible();
      await expect(page.locator('.custom-loading-content')).toBeVisible();

      await page.waitForSelector('span[title="Claudine Neal"]');

      await expect(page.locator('ghost-loader').first()).not.toBeVisible();
      await expect(page.locator('.custom-loading-content')).not.toBeVisible();

      await si.runVisualAndA11yTests('virtual-server-side-initial');

      await page.getByLabel('page 4').click();

      await expect(page.locator('ghost-loader').first()).toBeVisible();
      await expect(page.locator('.custom-loading-content')).toBeVisible();

      await page.waitForSelector('span[title="Freda Mason"]');

      await si.runVisualAndA11yTests('virtual-server-side-navigate', [
        {
          id: 'label',
          enabled: false
        },
        {
          id: 'empty-table-header',
          enabled: false
        },
        {
          id: 'aria-progressbar-name',
          enabled: false
        },
        {
          id: 'aria-required-children',
          enabled: false
        }
      ]);

      await page.getByRole('row', { name: 'Freda Mason' }).click();
      await page.mouse.wheel(0, 500);

      await expect(page.locator('.custom-loading-content')).toBeVisible();

      await page.waitForSelector('.datatable-body-cell-label');

      await expect(page.locator('.custom-loading-content')).toHaveCount(0);

      await si.runVisualAndA11yTests('virtual-server-side-scroll');
    });
  });
});

const pagerTest = async (page: Page, numberOfRows: number) => {
  const pager = page.locator('datatable-pager');
  expect(pager).toBeTruthy();

  const displayedRows = await page.locator('datatable-row-wrapper').all();
  expect(displayedRows).toHaveLength(numberOfRows);

  const firstPageButton = page.getByLabel('go to first page').locator('..');
  const previousButton = page.getByLabel('go to previous page').locator('..');
  const nextButton = page.getByLabel('go to next page').locator('..');
  const lastButton = page.getByLabel('go to last page').locator('..');

  await expect(firstPageButton).toHaveClass(/disabled/);
  await expect(previousButton).toHaveClass(/disabled/);
  await expect(nextButton).not.toHaveClass(/disabled/);
  await expect(lastButton).not.toHaveClass(/disabled/);

  await expect(page.getByRole('cell', { name: 'Ethel Price' })).toBeVisible();

  await lastButton.click();

  await expect(firstPageButton).not.toHaveClass(/disabled/);
  await expect(previousButton).not.toHaveClass(/disabled/);
  await expect(nextButton).toHaveClass(/disabled/);
  await expect(lastButton).toHaveClass(/disabled/);
};

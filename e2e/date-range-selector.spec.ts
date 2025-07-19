import { test, expect } from '@playwright/test'

test.describe('Date Range Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('期間選択ボタンが表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: /週/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /月/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /年/ })).toBeVisible()
  })

  test('期間選択ができる', async ({ page }) => {
    const weekButton = page.getByRole('button', { name: /週/ })
    const monthButton = page.getByRole('button', { name: /月/ })
    const yearButton = page.getByRole('button', { name: /年/ })

    await weekButton.click()
    await expect(weekButton).toHaveAttribute('aria-pressed', 'true')

    await monthButton.click()
    await expect(monthButton).toHaveAttribute('aria-pressed', 'true')
    await expect(weekButton).toHaveAttribute('aria-pressed', 'false')

    await yearButton.click()
    await expect(yearButton).toHaveAttribute('aria-pressed', 'true')
    await expect(monthButton).toHaveAttribute('aria-pressed', 'false')
  })
})
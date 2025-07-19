import { test, expect } from '@playwright/test'

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('APIからデータを取得して表示される', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    const table = page.getByRole('table')
    await expect(table).toBeVisible({ timeout: 10000 })
  })

  test('APIエラー時にエラーメッセージが表示される', async ({ page }) => {
    await page.route('**/api/health-data', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })

    await page.goto('/')
    
    await expect(page.getByText(/データの取得に失敗しました/i)).toBeVisible({ timeout: 10000 })
  })

  test('ローディング状態が表示される', async ({ page }) => {
    await page.route('**/api/health-data', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] })
        })
      }, 2000)
    })

    await page.goto('/')
    
    await expect(page.locator('[role="progressbar"]')).toBeVisible({ timeout: 5000 })
  })
})
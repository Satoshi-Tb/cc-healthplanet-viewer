import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test('モバイルビューでレスポンシブデザインが適用される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Health Planet Dashboard/ })).toBeVisible()
    
    const table = page.getByRole('table')
    await expect(table).toBeVisible()
    
    const exportButton = page.getByRole('button', { name: /csv.*エクスポート/i })
    await expect(exportButton).toBeVisible()
  })

  test('タブレットビューでレスポンシブデザインが適用される', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Health Planet Dashboard/ })).toBeVisible()
    
    const weightChart = page.getByTestId('weight-chart').locator('.recharts-wrapper')
    const bodyFatChart = page.getByTestId('body-fat-chart').locator('.recharts-wrapper')
    await expect(weightChart).toBeVisible({ timeout: 10000 })
    await expect(bodyFatChart).toBeVisible({ timeout: 10000 })
    
    const table = page.getByRole('table')
    await expect(table).toBeVisible()
  })

  test('デスクトップビューですべての要素が表示される', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Health Planet Dashboard/ })).toBeVisible()
    
    const weightChart = page.getByTestId('weight-chart').locator('.recharts-wrapper')
    const bodyFatChart = page.getByTestId('body-fat-chart').locator('.recharts-wrapper')
    await expect(weightChart).toBeVisible({ timeout: 10000 })
    await expect(bodyFatChart).toBeVisible({ timeout: 10000 })
    
    const table = page.getByRole('table')
    await expect(table).toBeVisible()
    
    const dateRangeButtons = page.getByRole('button', { name: /週|月|年/ })
    await expect(dateRangeButtons.first()).toBeVisible()
    
    const exportButton = page.getByRole('button', { name: /csv.*エクスポート/i })
    await expect(exportButton).toBeVisible()
  })
})
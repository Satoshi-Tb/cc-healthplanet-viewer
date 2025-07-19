import { test, expect } from '@playwright/test'

test.describe('Health Data Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('メインページが正しく表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/Health Planet/)
    await expect(page.getByRole('heading', { name: /Health Planet Dashboard/ })).toBeVisible()
  })

  test('データテーブルが表示される', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /日付/ })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /体重/ })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /体脂肪率/ })).toBeVisible()
  })

  test('チャートが表示される', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    const weightChart = page.getByTestId('weight-chart').locator('.recharts-wrapper')
    const bodyFatChart = page.getByTestId('body-fat-chart').locator('.recharts-wrapper')
    await expect(weightChart).toBeVisible({ timeout: 10000 })
    await expect(bodyFatChart).toBeVisible({ timeout: 10000 })
  })
})
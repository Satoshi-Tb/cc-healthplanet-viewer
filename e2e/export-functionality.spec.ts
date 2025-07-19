import { test, expect } from '@playwright/test'

test.describe('Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('CSVエクスポートボタンが表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: /csv.*エクスポート/i })).toBeVisible()
  })

  test('CSVエクスポートボタンをクリックできる', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /csv.*エクスポート/i }).click()
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('.csv')
  })

  test('エクスポートされたCSVファイルが有効な形式である', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /csv.*エクスポート/i }).click()
    
    const download = await downloadPromise
    const path = await download.path()
    
    if (path) {
      const fs = require('fs')
      const content = fs.readFileSync(path, 'utf8')
      
      expect(content).toContain('日付')
      expect(content).toContain('体重')
      expect(content).toContain('体脂肪率')
    }
  })
})
import { test, expect } from '@playwright/test'

test.describe('MacOS Desktop Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should have all 4 project titles available when windows are opened', async ({ page }) => {
    const apps = [
      { id: 'gamehub', title: 'GameHub' },
      { id: 'cryptopro', title: 'CryptoPro' },
      { id: 'unigo', title: 'Unigo' },
      { id: 'ttyt', title: 'ttyt' }
    ]
    
    for (const app of apps) {
      // Double click desktop icon to open
      await page.locator(`#desktop-icon-${app.id}`).dblclick()
      const heading = page.locator(`#window-${app.id} h2`)
      await expect(heading).toContainText(app.title)
      
      // Close window to prevent overlap with other icons
      await page.locator(`#window-${app.id} .control.close`).click()
    }
  })

  test('should render intro widget on desktop', async ({ page }) => {
    await expect(page.locator('.intro-widget')).toBeVisible()
    await expect(page.locator('.intro-name')).toHaveText('Kamran Gasimov')
  })

  test('should render profile widget on desktop', async ({ page }) => {
    await expect(page.locator('.profile-widget')).toBeVisible()
    await expect(page.locator('.profile-image')).toBeVisible()
    await expect(page.locator('.profile-image')).toHaveAttribute('src', '/me.png')
  })

  test('should have dock buttons with proper labels', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Open GameHub/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Open Contact/i })).toBeVisible()
    // Intro should not be in the dock anymore
    await expect(page.getByRole('button', { name: /Open Intro/i })).not.toBeVisible()
  })

  test('clicking dock item should open/focus window', async ({ page }) => {
    // GameHub is closed initially
    await expect(page.locator('#window-gamehub')).not.toBeVisible()
    
    // Click dock to open
    await page.getByRole('button', { name: /Open GameHub/i }).click()
    await expect(page.locator('#window-gamehub')).toBeVisible()
    
    // Check if it's active
    await expect(page.locator('#window-gamehub')).toHaveClass(/active/)
  })

  test('Finder should be active initially', async ({ page }) => {
    await expect(page.locator('.active-app-name')).toHaveText('Finder')
  })

  test('should show indicator dot in dock for open apps', async ({ page }) => {
    // GameHub is closed initially
    const gamehubButton = page.locator('li:has-text("GameHub")')
    await expect(gamehubButton.locator('.dock-indicator')).not.toBeVisible()
    
    // Open GameHub
    await page.locator('#desktop-icon-gamehub').dblclick()
    await expect(gamehubButton.locator('.dock-indicator')).toBeVisible()
  })

  test('closing a window should remove it from openApps', async ({ page }) => {
    // Open GameHub
    await page.locator('#desktop-icon-gamehub').dblclick()
    await expect(page.locator('#window-gamehub')).toBeVisible()
    
    // Click close button
    await page.locator('#window-gamehub .control.close').click()
    await expect(page.locator('#window-gamehub')).not.toBeVisible()
    
    // Check indicator in dock
    const gamehubButton = page.locator('li:has-text("GameHub")')
    await expect(gamehubButton.locator('.dock-indicator')).not.toBeVisible()
  })

  test('menu bar should show active app name', async ({ page }) => {
    await expect(page.locator('.active-app-name')).toHaveText('Finder')
    
    await page.locator('#desktop-icon-gamehub').dblclick()
    await expect(page.locator('.active-app-name')).toHaveText('GameHub')
  })

  test('minimizing a window should hide it but keep indicator', async ({ page }) => {
    // Open GameHub
    await page.locator('#desktop-icon-gamehub').dblclick()
    await expect(page.locator('#window-gamehub')).toBeVisible()
    
    // Click minimize button
    await page.locator('#window-gamehub .control.minimize').click()
    await expect(page.locator('#window-gamehub')).not.toBeVisible()
    
    // Check indicator in dock (should still be there)
    const gamehubButton = page.locator('li:has-text("GameHub")')
    await expect(gamehubButton.locator('.dock-indicator')).toBeVisible()
    
    // Click dock to bring back
    await page.getByRole('button', { name: /Open GameHub/i }).click()
    await expect(page.locator('#window-gamehub')).toBeVisible()
  })
})
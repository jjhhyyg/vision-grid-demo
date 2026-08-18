import { expect, test } from '@playwright/test'

test('renders all synthetic demo views without production network traffic', async ({ page }) => {
  const unexpectedRequests = []
  page.on('request', (request) => {
    const url = request.url()
    if (/\/api\/|\/ws\/|192\.168\.|172\.18\./.test(url)) unexpectedRequests.push(url)
  })

  await page.goto('/')

  await expect(page).toHaveTitle('工业表面视觉检测工作站 / DEMO')
  await expect(page.getByText('DEMO / SYNTHETIC DATA')).toBeVisible()
  await expect(page.getByTestId('portfolio-demo-live')).toBeVisible()

  const localClock = page.locator('.demo-meta time')
  await expect(localClock).toHaveText(/^\d{4}\.\d{2}\.\d{2}\s{2}\d{2}:\d{2}:\d{2}$/)
  await expect(localClock).toHaveCSS('width', '176px')
  const initialClock = await localClock.textContent()
  await expect.poll(() => localClock.textContent()).not.toBe(initialClock)

  await page.getByRole('button', { name: /历史追溯/ }).click()
  await expect(page.getByTestId('portfolio-demo-trace')).toBeVisible()

  await page.getByRole('button', { name: /模型治理/ }).click()
  await expect(page.getByTestId('portfolio-demo-governance')).toBeVisible()

  expect(unexpectedRequests).toEqual([])
})

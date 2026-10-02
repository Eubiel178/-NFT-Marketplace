import { expect, test } from '@playwright/test'

// Every test receives a fresh browser context: storage and mock DB are isolated.
test('catálogo REST e detalhe por acesso direto', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Coleção 01' })).toBeVisible()
  await page.getByRole('link', { name: 'Coleção 01' }).click()
  await expect(page.getByRole('heading', { name: 'Coleção 01' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('0.001 ETH', { exact: true })).toBeVisible()
  await page.goto('/nfts/missing')
  await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
})

test('parâmetros da URL chegam ao mock REST', async ({ page }) => {
  await page.goto('/?q=Coleção&category=music&sort=price-desc&page=2')
  await expect(page.getByText('8 NFTs encontrados')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Coleção 05' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Coleção 02' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('link', { name: 'Coleção 05' })).toBeVisible()
})

test('guarda privada preserva destino e rota desconhecida informa erro', async ({ page }) => {
  await page.goto('/checkout')
  await expect(page).toHaveURL(/login\?redirect=%2Fcheckout/)
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await page.goto('/missing')
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
})

test('evento Socket.IO reconcilia detalhe com REST e persiste após refresh', async ({ page }) => {
  await page.goto('/nfts/nft-1')
  await expect(page.getByText('0.001 ETH', { exact: true })).toBeVisible()
  // Wait for the actual Socket.IO namespace handshake, not a UI callback.
  await expect(page.getByRole('status').filter({ hasText: 'Atualizações em tempo real conectadas' })).toBeVisible()
  await page.evaluate(async () => {
    await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' })
  })
  await expect(page.getByText('0.125 ETH', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText('0.125 ETH', { exact: true })).toBeVisible()
})

test('skeleton, erro e recuperação usam MSW', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'slow'))
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Carregando catálogo' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Coleção 01' })).toBeVisible()
  await page.evaluate(async () => { await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: 'http-500' }) }) })
  await page.getByRole('link', { name: 'Coleção 01' }).click()
  await expect(page.getByRole('alert')).toContainText('Falha ao carregar NFT')
  await page.evaluate(async () => { await fetch('/api/__mock/reset', { method: 'POST' }) })
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Coleção 01' })).toBeVisible()
})

test('link de salto por teclado e ausência de overflow na estrutura', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Catálogo — integração inicial' })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

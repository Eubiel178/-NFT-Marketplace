import { expect, test } from './test'

// Every test receives a fresh browser context: storage and mock DB are isolated.
test('catálogo REST e detalhe por acesso direto', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
  await page.getByRole('link', { name: /Emerald Ape #042/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('nft-price')).toHaveText('1.19 ETH')
  await page.goto('/nfts/missing')
  await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
})

test('parâmetros da URL chegam ao mock REST', async ({ page }) => {
  await page.goto('/?q=Golden&category=all&sort=price-desc&page=1')
  await expect(page.getByText('3 NFTs encontrados')).toHaveText('3 NFTs encontrados')
  await expect(page.getByRole('link', { name: /Golden Beat #207/ }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Golden Signal #160/ }).first()).toBeVisible()
  await page.reload()
  await expect(page.getByRole('link', { name: /Golden Beat #207/ }).first()).toBeVisible()
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
  await expect(page.getByTestId('nft-price')).toHaveText('1.19 ETH')
  // The updated price below confirms the Socket.IO event triggered reconciliation.
  await page.evaluate(async () => {
    await fetch('/api/__mock/nfts/nft-1/update', { method: 'POST' })
  })
  await expect(page.getByTestId('nft-price')).toHaveText('0.125 ETH')
  await page.reload()
  await expect(page.getByTestId('nft-price')).toHaveText('0.125 ETH')
})

test('skeleton, erro e recuperação usam MSW', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'slow'))
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Carregando catálogo' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Emerald Ape #042/ }).first()).toBeVisible()
  await page.evaluate(async () => { await fetch('/api/__mock/scenario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario: 'http-500' }) }) })
  await page.getByRole('link', { name: /Emerald Ape #042/ }).first().click()
  await expect(page.getByRole('alert')).toContainText('Falha ao carregar NFT')
  await page.evaluate(async () => { await fetch('/api/__mock/reset', { method: 'POST' }) })
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
})

test('link de salto por teclado e ausência de overflow na estrutura', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1:visible').filter({ hasText: 'SEJA DONO' })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('estrutura responsiva alterna sidebar, drawer e tab bar', async ({ page }) => {
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Filtros do catálogo' })
  const filterTrigger = page.getByRole('button', { name: 'Abrir filtros' })
  const tabBar = page.getByRole('navigation', { name: 'Navegação principal' })

  if (page.viewportSize()?.width === 1440) {
    await expect(sidebar).toBeVisible()
    await expect(filterTrigger).toBeHidden()
    await expect(tabBar).toBeHidden()
    return
  }

  await expect(sidebar).toBeHidden()
  await expect(filterTrigger).toBeVisible()
  await expect(tabBar).toBeVisible()
  await filterTrigger.click()
  await expect(page.getByRole('dialog', { name: 'Filtros' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Filtros' })).toBeHidden()
})

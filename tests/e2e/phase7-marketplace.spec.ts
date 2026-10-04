import { expect, test } from './test'

test('busca e filtros combinados refletem os parâmetros da URL', async ({ page }) => {
  await page.goto('/?q=Golden&network=polygon&priceMax=0.50')

  const resultGrid = page.getByRole('list', { name: 'NFTs do catálogo' })
  await expect(resultGrid.getByRole('link', { name: /Golden Signal #160/ })).toHaveCount(1)
  if ((page.viewportSize()?.width ?? 0) >= 640) await expect(page.getByRole('status').filter({ hasText: 'NFTs encontrados' })).toHaveText('1 NFTs encontrados')
  await expect(page).toHaveURL(/q=Golden/)
  await expect(page).toHaveURL(/network=polygon/)
  await expect(page).toHaveURL(/priceMax=/)
  await page.reload()
  await expect(page.getByRole('list', { name: 'NFTs do catálogo' })).toBeVisible()
})

test('busca digitada aguarda debounce e reinicia a página', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 640, 'O campo de busca está no layout mobile do Figma')
  await page.goto('/?page=2')

  const search = page.getByRole('textbox', { name: 'Explorar coleções' })
  await search.fill('Golden')
  await expect(page).toHaveURL(/q=Golden/)
  await expect(page).toHaveURL(/page=1/)
  await expect(page.getByRole('list', { name: 'NFTs do catálogo' }).getByRole('link', { name: /Golden Signal #160/ }).first()).toBeVisible()
})

test('alterar um filtro reinicia a paginação e o histórico restaura a página anterior', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) < 640, 'O Figma remove a paginação no mobile')
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Página 2' })).toBeVisible()
  await page.getByRole('button', { name: 'Página 2' }).click()
  await expect(page).toHaveURL(/page=2/)

  const filterRoot = (page.viewportSize()?.width ?? 1440) < 1024
    ? await (async () => {
        await page.getByRole('button', { name: 'Abrir filtros' }).first().click()
        return page.getByRole('dialog', { name: 'Filtros' }).getByRole('complementary', { name: 'Filtros do catálogo' })
      })()
    : page.getByRole('complementary', { name: 'Filtros do catálogo' })

  await filterRoot.getByRole('button', { name: 'Fotografia' }).click()
  await expect(page).toHaveURL(/collection=Fotografia/)
  await expect(page).toHaveURL(/page=1/)
  await page.goBack()
  await expect(page).toHaveURL(/page=2/)
})

test('estado vazio é servido pelo cenário MSW', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'empty'))
  await page.goto('/')

  await expect(page.getByRole('status')).toContainText('Nenhum NFT encontrado')
})

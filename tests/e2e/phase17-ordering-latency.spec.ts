import { expect, test, type Page } from './test'

interface ApiPage {
  items: Array<{ name: string; price: string }>
}

// Exatamente a página que o MSW devolve para os mesmos parâmetros: é a referência do que a UI deve mostrar.
async function apiPage(page: Page, query: string) {
  return page.evaluate(async (search) => (await fetch(`/api/nfts?${search}`)).json() as Promise<ApiPage>, query)
}

function renderedNames(page: Page) {
  return page.getByRole('list', { name: 'NFTs do catálogo' }).getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('aria-label') ?? ''))
}

// ETH decimal → inteiro em wei, sem float.
function wei(value: string) {
  const [whole, fraction = ''] = value.split('.')
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'))
}

test('ordenar por preço (menor e maior) mostra a ordem da API e reinicia a paginação', async ({ page }) => {
  await page.goto('/?page=2')
  await expect(page.getByRole('list', { name: 'NFTs do catálogo' })).toBeVisible()

  await page.getByRole('button', { name: 'Novos lançamentos' }).click()
  await expect(page).toHaveURL(/sort=price-asc/)
  await expect(page).toHaveURL(/page=1/)
  const ascending = await apiPage(page, 'sort=price-asc&page=1')
  const ascendingPrices = ascending.items.map((item) => wei(item.price))
  expect(ascendingPrices).toEqual([...ascendingPrices].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)))
  await expect.poll(() => renderedNames(page)).toEqual(ascending.items.map((item) => item.name))

  await page.getByRole('button', { name: 'Em alta' }).click()
  await expect(page).toHaveURL(/sort=price-desc/)
  const descending = await apiPage(page, 'sort=price-desc&page=1')
  const descendingPrices = descending.items.map((item) => wei(item.price))
  expect(descendingPrices).toEqual([...descendingPrices].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)))
  await expect.poll(() => renderedNames(page)).toEqual(descending.items.map((item) => item.name))

  await page.reload()
  await expect(page.getByRole('button', { name: 'Em alta' })).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => renderedNames(page)).toEqual(descending.items.map((item) => item.name))
})

test('ordenar por nome (seletor no desktop, URL no mobile) segue a ordem alfabética da API', async ({ page }) => {
  await page.goto('/')
  const sortSelect = page.getByRole('combobox', { name: 'Ordenar por' })
  if (await sortSelect.isVisible()) {
    await sortSelect.selectOption('name')
    await expect(page).toHaveURL(/sort=name/)
  } else {
    // O frame mobile não tem o seletor; a ordenação vem da URL.
    await page.goto('/?sort=name')
  }

  // O MSW só atende depois que a aplicação carregou.
  await expect(page.getByRole('list', { name: 'NFTs do catálogo' })).toBeVisible()
  const byName = await apiPage(page, 'sort=name&page=1')
  const names = byName.items.map((item) => item.name)
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  await expect.poll(() => renderedNames(page)).toEqual(names)
})

test('respostas fora de ordem: a UI mostra a última consulta, nunca a resposta atrasada', async ({ page }) => {
  // variable-latency: páginas ímpares levam 900 ms, pares 100 ms.
  await page.addInitScript(() => localStorage.setItem('nft-marketplace:scenario', 'variable-latency'))
  await page.goto('/?page=2')
  await expect(page.getByRole('list', { name: 'NFTs do catálogo' }).getByRole('link').first()).toBeVisible()

  const requested: number[] = []
  page.on('request', (request) => {
    const match = /\/api\/nfts\?.*page=(\d+)/.exec(request.url())
    if (match) requested.push(Number(match[1]))
  })

  // Página 3 (lenta) é pedida primeiro e a 4 (rápida) logo depois: a 3 chegaria depois da 4.
  await page.getByRole('button', { name: 'Próxima página' }).click()
  await page.getByRole('button', { name: 'Página 4', exact: true }).click()
  await expect(page).toHaveURL(/page=4/)
  expect(requested.slice(0, 2)).toEqual([3, 4])

  const expected = (await apiPage(page, 'page=4')).items.map((item) => item.name)
  const stale = (await apiPage(page, 'page=3')).items.map((item) => item.name)
  await expect.poll(() => renderedNames(page)).toEqual(expected)

  // Passado o atraso da página 3, a tela continua na página 4.
  await page.waitForTimeout(1_300)
  expect(await renderedNames(page)).toEqual(expected)
  expect(await renderedNames(page)).not.toEqual(stale)
  await expect(page.getByRole('button', { name: 'Página 4', exact: true })).toHaveAttribute('aria-current', 'page')
})

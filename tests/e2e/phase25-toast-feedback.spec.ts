import { expect, test, type Page } from './test'

async function signIn(page: Page, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect}$`))
}

// O Sonner monta uma região aria-live="polite": os leitores de tela anunciam o toast sem mover o foco.
function toastRegion(page: Page) {
  return page.locator('section[aria-live="polite"]')
}

test('favoritar anuncia o resultado em um toast aria-live', async ({ page }) => {
  await signIn(page, '/nfts/nft-1')
  await page.getByRole('button', { name: /favorit/i }).first().click()
  await expect(toastRegion(page)).toContainText('Adicionado aos favoritos')
})

test('salvar o perfil anuncia o resultado em um toast aria-live', async ({ page }) => {
  await signIn(page, '/profile')
  await page.getByRole('button', { name: /^Salvar/ }).first().click()
  await expect(toastRegion(page)).toContainText('Alterações salvas')
})

test('aplicar cupom válido anuncia o resultado em um toast aria-live', async ({ page }) => {
  await signIn(page, '/cart')
  await page.getByLabel('Código promocional').fill('KURIO10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(toastRegion(page)).toContainText('Cupom KURIO10 aplicado')
})

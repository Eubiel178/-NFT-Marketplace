import { expect, test } from './test'

async function signIn(page: import('@playwright/test').Page, email: string, password: string, redirect: string) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}&expired=false`)
  await page.getByLabel('Email').fill(email)
  await page.getByRole('textbox', { name: 'Senha' }).fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(new RegExp(`${redirect.replace('/', '\\/')}$`))
}

test('login rejeita credenciais inválidas e cadastro rejeita email duplicado', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('senha-incorreta')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByRole('alert')).toContainText('Email ou senha inválidos')

  await page.goto('/register')
  await page.getByLabel('Nome de usuário').fill('Outra Ana')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('kurio-demo')
  await page.getByRole('textbox', { name: 'Confirmar senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Criar perfil' }).click()
  await expect(page.getByRole('alert')).toContainText('Este email já está cadastrado')
})

test('cadastro cria sessão e retorna ao destino solicitado', async ({ page }) => {
  await page.goto('/register?redirect=%2Fprofile&expired=false')
  await page.getByLabel('Nome de usuário').fill('Nova Colecionadora')
  await page.getByLabel('Email').fill('nova@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('nova-senha-123')
  await page.getByRole('textbox', { name: 'Confirmar senha' }).fill('nova-senha-123')
  await page.getByRole('button', { name: 'Criar perfil' }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  await expect(page.getByText('Nova Colecionadora', { exact: true })).toBeVisible()
})

test('sessão sobrevive ao refresh, logout limpa o acesso e permite trocar de usuário', async ({ page }) => {
  await signIn(page, 'ana@example.test', 'kurio-demo', '/profile')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  await expect(page.getByText('Ana Demo', { exact: true })).toBeVisible()
  await page.getByRole('complementary', { name: 'Navegação da conta' }).getByRole('button', { name: 'Sair' }).click()
  await expect(page).toHaveURL(/\/$/)

  await signIn(page, 'bruno@example.test', 'bruno-demo', '/profile')
  await expect(page.getByText('Bruno Demo', { exact: true })).toBeVisible()
})

test('sessão expirada preserva o checkout e informa a retomada', async ({ page }) => {
  await signIn(page, 'ana@example.test', 'kurio-demo', '/checkout')
  await page.evaluate(async () => { await fetch('/api/__mock/session/expire', { method: 'POST' }) })
  await page.goto('/checkout')
  await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout&expired=true/)
  await expect(page.getByRole('alert')).toContainText('Sua sessão expirou')
  await page.getByLabel('Email').fill('ana@example.test')
  await page.getByRole('textbox', { name: 'Senha' }).fill('kurio-demo')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/checkout$/)
})

test('erro de confirmação de senha fica associado ao campo', async ({ page }) => {
  await page.goto('/register')
  await page.getByLabel('Nome de usuário').fill('Validação de Campo')
  await page.getByLabel('Email').fill('campo@example.test')
  await page.getByRole('textbox', { name: 'Senha', exact: true }).fill('senha-valida')
  const confirmation = page.getByRole('textbox', { name: 'Confirmar senha' })
  await confirmation.fill('senha-diferente')
  await page.getByRole('button', { name: 'Criar perfil' }).click()
  const describedBy = await confirmation.getAttribute('aria-describedby')
  expect(describedBy).toBeTruthy()
  await expect(page.locator(`#${describedBy}`)).toHaveText('As senhas precisam ser iguais')
})

test('favoritos não vazam ao trocar de usuário', async ({ page }) => {
  await signIn(page, 'ana@example.test', 'kurio-demo', '/nfts/nft-1')
  const initialFavorite = (page.viewportSize()?.width ?? 0) < 640
    ? page.getByRole('button', { name: 'Adicionar aos favoritos' }).first()
    : page.getByRole('button', { name: 'Favoritar', exact: true })
  await initialFavorite.click()
  const activeFavorite = (page.viewportSize()?.width ?? 0) < 640
    ? page.getByRole('button', { name: 'Remover dos favoritos' }).first()
    : page.getByRole('button', { name: 'Favoritado', exact: true })
  await expect(activeFavorite).toBeVisible()

  await page.goto('/profile')
  await page.getByRole('complementary', { name: 'Navegação da conta' }).getByRole('button', { name: 'Sair' }).click()
  await expect(page).toHaveURL(/\/$/)
  await signIn(page, 'bruno@example.test', 'bruno-demo', '/nfts/nft-1')
  const favoriteButton = (page.viewportSize()?.width ?? 0) < 640
    ? page.getByRole('button', { name: 'Adicionar aos favoritos' }).first()
    : page.getByRole('button', { name: 'Favoritar', exact: true })
  await expect(favoriteButton).toBeVisible()
})

import { Link, useSearch } from '@tanstack/react-router'

import { Button, Image, Input, MobileSocialBlock, PasswordInput, SocialButton } from '@/components'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

import { AuthMarketplaceBackground } from '../auth-marketplace-background'
import { useAuthForm } from '../hooks/use-auth-form'
import type { AuthMode } from '../lib/auth-form'

// Campo do frame: rótulo só para leitores de tela, 40px no desktop e 50px no mobile.
const fieldLabel = 'sr-only'
const field = 'h-12.5 rounded-10 bg-transparent text-body-14 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-offset-0 sm:h-10 sm:rounded-3'

const socialButton = 'h-10 rounded-3 bg-transparent px-5 text-caption-13 font-normal tracking-normal text-text-secondary hover:bg-surface-raised'

const hiddenIcon = <Image src="/assets/figma/mcp/svg/iconly-curved-hide.svg" alt="" width={23} height={20} className="h-4 w-4.5" />

// Login e cadastro diferem nos espaçamentos do frame desktop.
const spacing = {
  login: { submit: 'sm:mt-3.25', social: 'sm:gap-3', socialList: 'mt-3', bottom: 'sm:pb-23.25', heading: 'text-title-20-bold' },
  register: { submit: 'sm:mt-3', social: 'sm:gap-4', socialList: 'mt-3 sm:mt-4', bottom: 'sm:pb-16.25', heading: 'text-body-large-18-bold' },
} as const

const copy = {
  login: { heading: 'Entrar', subtitle: 'Entre para gerenciar sua carteira, coleção e perfil de criador.', submit: 'Entrar' },
  register: { heading: 'Criar perfil de colecionador', subtitle: 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.', submit: 'Criar perfil' },
} as const

export function AuthPage({ mode }: { mode: AuthMode }) {
  const search = useSearch({ strict: false }) as { redirect?: string; expired?: boolean | string }
  const auth = useAuthForm(mode, search.redirect)
  const showBackground = useMediaQuery('(width >= 40rem)')
  const isLogin = mode === 'login'
  const expired = search.expired === true || search.expired === 'true'
  const authSearch = { redirect: search.redirect ?? '/', expired: false }

  return (
    <section aria-labelledby="auth-title" className="sm:grid sm:*:[grid-area:1/1]">
      {showBackground && <AuthMarketplaceBackground />}
      <div
        data-auth-card
        className={cn(
          'relative z-10 max-sm:px-1 max-sm:pt-25.75 sm:mt-22.75 sm:w-125 sm:justify-self-center sm:self-start sm:border-b-10 sm:border-b-primary sm:bg-surface-card',
          spacing[mode].bottom,
        )}
      >
        <p aria-hidden="true" className="text-center text-display-32-bold text-foreground sm:hidden">KURIO</p>
        <Link to="/" aria-label="Fechar" className="absolute top-1 right-1.25 grid size-8 place-items-center rounded-4 max-sm:hidden">
          <Image src="/assets/figma/mcp/svg/close-x.svg" alt="" width={18} height={18} className="size-4.5" />
        </Link>
        <nav aria-label="Autenticação" className="flex items-center justify-center gap-2 pt-11.75 text-title-20 leading-24 max-sm:hidden">
          <Link to="/login" search={authSearch} aria-current={isLogin ? 'page' : undefined} className={cn(isLogin ? 'text-text-accent' : 'text-foreground')}>Entrar</Link>
          <span aria-hidden="true" className="h-5.5 w-px bg-primary" />
          <Link to="/register" search={authSearch} aria-current={isLogin ? undefined : 'page'} className={cn(isLogin ? 'text-foreground' : 'text-text-accent')}>Criar conta</Link>
        </nav>
        <h1
          id="auth-title"
          aria-label={isLogin ? 'Login' : undefined}
          className={cn(spacing[mode].heading, 'mt-20.5 text-center leading-24 text-foreground sm:sr-only')}
        >
          {copy[mode].heading}
        </h1>
        <p className="mx-auto mt-9.25 w-100 text-center text-caption-13 leading-16 text-foreground max-sm:hidden">{copy[mode].subtitle}</p>

        <div className="sm:px-20">
          {expired && (
            <p role="alert" className="mt-4 text-center text-caption-13 text-error">
              Sua sessão expirou. Entre novamente para retomar o fluxo que estava aberto.
            </p>
          )}
          <form
            noValidate
            aria-describedby={auth.formError ? 'auth-form-error' : undefined}
            className="mt-8.75 grid gap-3 sm:mt-6"
            onSubmit={(event) => {
              event.preventDefault()
              auth.submit()
            }}
          >
            {!isLogin && (
              <Input
                label="Nome de usuário"
                placeholder="Nome de usuário"
                autoComplete="username"
                value={auth.values.username}
                onChange={(event) => auth.setField('username', event.target.value)}
                error={auth.errors.username}
                labelClassName={fieldLabel}
                inputClassName={cn(field, 'max-sm:placeholder:text-center')}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder={isLogin ? 'contato@email.com' : 'Digite seu e-mail'}
              autoComplete="email"
              value={auth.values.email}
              onChange={(event) => auth.setField('email', event.target.value)}
              error={auth.errors.email}
              labelClassName={fieldLabel}
              inputClassName={field}
            />
            <PasswordInput
              id="auth-password"
              label="Senha"
              placeholder="Senha"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={auth.values.password}
              onChange={(event) => auth.setField('password', event.target.value)}
              error={auth.errors.password}
              labelClassName={fieldLabel}
              inputClassName={field}
              hiddenIcon={hiddenIcon}
            />
            {!isLogin && (
              <PasswordInput
                id="auth-confirm-password"
                label="Confirmar senha"
                placeholder="Confirmar senha"
                autoComplete="new-password"
                value={auth.values.confirmPassword}
                onChange={(event) => auth.setField('confirmPassword', event.target.value)}
                error={auth.errors.confirmPassword}
                labelClassName={fieldLabel}
                inputClassName={field}
                hiddenIcon={hiddenIcon}
                // O frame desktop não tem o botão de mostrar senha na confirmação; o mobile tem.
                toggleClassName="sm:hidden"
              />
            )}
            {isLogin && (
              <button type="button" onClick={() => auth.chooseUnavailable('password-recovery')} className="justify-self-end text-body-14 leading-16 text-text-accent">
                Esqueceu a senha?
              </button>
            )}
            {auth.formError && <p id="auth-form-error" role="alert" className="text-caption-13 text-error">{auth.formError}</p>}
            <Button
              type="submit"
              variant="primarySolid"
              loading={auth.pending}
              className={cn('mt-7 h-15 min-h-0 rounded-10 text-body-large-16-bold font-bold tracking-normal sm:h-11 sm:rounded-3 sm:text-body-15-bold', spacing[mode].submit)}
            >
              {copy[mode].submit}
            </Button>
          </form>

          <MobileSocialBlock separatorClassName="mt-10 sm:-mx-20 sm:mt-6" listClassName={cn('gap-4', spacing[mode].socialList, spacing[mode].social)}>
            <SocialButton provider="google" icon={<Image src="/assets/icons/google.svg" alt="" width={20} height={20} className="size-5" />} onClick={() => auth.chooseUnavailable('google')} className={socialButton}>
              Continuar com Google
            </SocialButton>
            <SocialButton provider="facebook" icon={<Image src="/assets/icons/facebook.svg" alt="" width={12} height={20} className="h-5 w-3" />} onClick={() => auth.chooseUnavailable('facebook')} className={socialButton}>
              Continuar com Facebook
            </SocialButton>
          </MobileSocialBlock>
          <p role="status" className="mt-3 text-center text-caption-13 text-text-secondary empty:hidden">{auth.notice}</p>

          <p className="mt-9.75 text-center text-body-15 leading-24 text-text-secondary sm:hidden">
            {isLogin ? 'Novo na Kurio? ' : 'Já tem uma conta? '}
            {isLogin ? <Link to="/register" search={authSearch}>Crie uma conta</Link> : <Link to="/login" search={authSearch}>Entre</Link>}
          </p>
        </div>
      </div>
    </section>
  )
}

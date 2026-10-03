import { useState } from 'react'

import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { X } from 'lucide-react'

import { Button, Input, MobileSocialBlock, PasswordInput, SocialButton } from '@/components'
import { apiErrorSchema } from '@/contracts'
import { keys, queryClient } from '@/lib/query'

import { login, register } from '../api'

type AuthMode = 'login' | 'register'

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { redirect?: string; expired?: boolean | string }
  const isLogin = mode === 'login'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const expired = search.expired === true || search.expired === 'true'
  const [formError, setFormError] = useState<string>()
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>()
  const mutation = useMutation({
    mutationFn: () => isLogin ? login({ email, password }) : register({ username, email, password, confirmPassword }),
    onSuccess: async (session) => {
      await queryClient.cancelQueries()
      queryClient.clear()
      queryClient.setQueryData(keys.session, session)
      await navigate({ to: search.redirect?.startsWith('/') ? search.redirect : '/' })
    },
  })
  const apiError = axios.isAxiosError(mutation.error) ? apiErrorSchema.safeParse(mutation.error.response?.data).data : undefined
  const fieldErrors = apiError?.fields
  const apiMessage = apiError?.message
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(undefined)
    setConfirmPasswordError(undefined)
    if (!isLogin && password !== confirmPassword) {
      setConfirmPasswordError('As senhas precisam ser iguais')
      return
    }
    mutation.mutate()
  }

  return (
    <section className="auth-shell" aria-labelledby="auth-title">
      <div className="auth-backdrop" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-mobile-logo" aria-hidden="true">KURIO</div>
        <button type="button" className="auth-close" onClick={() => void navigate({ to: '/' })} aria-label="Fechar"><X aria-hidden="true" /></button>
         <nav className="auth-tabs" aria-label="Autenticação">
           <Link to="/login" search={{ redirect: search.redirect ?? '/', expired: false }} className={isLogin ? 'is-active' : ''} aria-current={isLogin ? 'page' : undefined}>Entrar</Link>
           <Link to="/register" search={{ redirect: search.redirect ?? '/', expired: false }} className={!isLogin ? 'is-active' : ''} aria-current={!isLogin ? 'page' : undefined}>Criar conta</Link>
         </nav>
        <h1 id="auth-title" aria-label={isLogin ? 'Login' : undefined}>{isLogin ? 'Entrar' : 'Criar perfil de colecionador'}</h1>
        <p className="auth-subtitle">{isLogin ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.' : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}</p>
        {expired && <p className="auth-error" role="alert">Sua sessão expirou. Entre novamente para retomar o fluxo que estava aberto.</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
           {!isLogin && <Input label="Nome de usuário" placeholder="Nome de usuário" value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} autoComplete="username" error={fieldErrors?.username} />}
           <Input label="Email" placeholder={isLogin ? 'contato@email.com' : 'Digite seu e-mail'} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" error={fieldErrors?.email} />
           <PasswordInput id="auth-password" label="Senha" placeholder="Senha" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={isLogin ? 'current-password' : 'new-password'} error={fieldErrors?.password} />
            {!isLogin && <PasswordInput id="auth-confirm-password" label="Confirmar senha" placeholder="Confirmar senha" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" error={fieldErrors?.confirmPassword ?? confirmPasswordError} showToggle={false} />}
          {isLogin && <Link to="/login" search={{ redirect: search.redirect ?? '/', expired: false }} className="auth-forgot">Esqueci minha senha</Link>}
          {(formError || (apiMessage && !fieldErrors)) && <p className="auth-error" role="alert">{formError ?? apiMessage}</p>}
          <Button type="submit" size="pillLg" loading={mutation.isPending}>{isLogin ? 'Entrar' : 'Criar perfil'}</Button>
        </form>
          <MobileSocialBlock>
            <SocialButton provider="google" icon={<span aria-hidden="true">G</span>}>Continuar com Google</SocialButton>
            <SocialButton provider="facebook" icon={<span aria-hidden="true">f</span>}>Continuar com Facebook</SocialButton>
          </MobileSocialBlock>
        <p className="auth-switch">
          {isLogin ? 'Novo na Kurio? ' : 'Já tem uma conta? '}
           {isLogin ? <Link to="/register" search={{ redirect: search.redirect ?? '/', expired: false }}>Crie uma conta</Link> : <Link to="/login" search={{ redirect: search.redirect ?? '/', expired: false }}>Entre</Link>}
        </p>
      </div>
    </section>
  )
}

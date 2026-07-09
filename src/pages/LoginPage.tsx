import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthHeroHeader, AuthLayout, AuthSessionLoader } from '@/components/auth/AuthLayout'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { PasswordInput } from '@/shared/components/ui/password-input'
import { useLogin, useAuth } from '@/hooks/useAuth'
import { buildInvitationAcceptPath, resolveInviteToken } from '@/hooks/useInvitations'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, initializing } = useAuth()
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const inviteToken = resolveInviteToken(new URLSearchParams(location.search))
  const returnTo =
    (location.state as { from?: string } | undefined)?.from ??
    (inviteToken ? buildInvitationAcceptPath(inviteToken) : undefined)

  useEffect(() => {
    if (!isAuthenticated) return
    const destination = returnTo && returnTo !== '/login' ? returnTo : '/workspaces'
    navigate(destination, { replace: true })
  }, [isAuthenticated, navigate, returnTo])

  if (initializing) {
    return (
      <AuthSessionLoader
        message={
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Checking your session…
          </>
        }
      />
    )
  }

  if (isAuthenticated) {
    return (
      <AuthSessionLoader
        message={
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirecting…
          </>
        }
      />
    )
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!email.trim()) {
      setFormError('Email is required')
      return
    }
    if (!password) {
      setFormError('Password is required')
      return
    }

    const destination = returnTo && returnTo !== '/login' ? returnTo : '/workspaces'

    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
        redirectTo: destination,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const displayError = formError ?? (loginMutation.isError ? loginMutation.error.message : null)

  return (
    <AuthLayout>
      <AuthHeroHeader />

      <div>
        <h2 className="text-2xl font-semibold text-foreground">Sign in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your credentials to access your workspaces
        </p>
      </div>

      {displayError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {displayError}
        </div>
      )}

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <PasswordInput
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <Button type="submit" disabled={loginMutation.isPending} className="w-full">
          {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          to={inviteToken ? `/register?invite=${encodeURIComponent(inviteToken)}` : '/register'}
          state={returnTo ? { from: returnTo } : undefined}
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </p>

      <div className="text-center text-xs text-muted-foreground">© 2026 FractalHive</div>
    </AuthLayout>
  )
}

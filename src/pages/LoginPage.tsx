import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import logo from '@/assets/FractalHive_Logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useLogin } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const returnTo = (location.state as { from?: string } | undefined)?.from

  useEffect(() => {
    if (!isAuthenticated) return
    const destination = returnTo && returnTo !== '/login' ? returnTo : '/workspaces'
    navigate(destination, { replace: true })
  }, [isAuthenticated, navigate, returnTo])

  if (isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Redirecting…
        </div>
      </div>
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
    <div className="flex min-h-screen w-screen justify-center bg-background font-sans text-base leading-normal text-foreground antialiased">
      <section className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <img
                src={logo}
                alt="ptrack logo"
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = '/favicon.svg'
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">P-Track</h1>
            <p className="text-sm text-muted-foreground">Project Tracker by FractalHive</p>
          </div>

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

          <div className="text-center text-xs text-muted-foreground">© 2026 FractalHive</div>
        </div>
      </section>

      <section className="hidden h-screen w-1/2 items-center justify-center lg:flex">
        <div className="h-full w-full p-8">
          <div className="login-hero-panel relative h-full w-full overflow-hidden rounded-[28px]">
            <div className="login-hero-overlay-pink absolute inset-0 opacity-95" />
            <div className="login-hero-overlay-warm absolute inset-0 opacity-95" />
            <div className="login-hero-overlay-deep absolute inset-0 opacity-90" />
            <div className="login-hero-glow-left absolute -left-24 top-28 h-52 w-56 rounded-full blur-3xl" />
            <div className="login-hero-glow-right absolute right-4 top-0 h-72 w-72 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  )
}

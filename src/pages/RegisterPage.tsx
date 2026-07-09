import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthHeroHeader, AuthLayout, AuthSessionLoader } from '@/components/auth/AuthLayout'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { PasswordInput } from '@/shared/components/ui/password-input'
import { useAuth, useRegister } from '@/hooks/useAuth'
import { buildInvitationAcceptPath, resolveInviteToken } from '@/hooks/useInvitations'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, initializing } = useAuth()
  const registerMutation = useRegister()

  const inviteToken = resolveInviteToken(new URLSearchParams(location.search))
  const returnTo =
    (location.state as { from?: string } | undefined)?.from ??
    (inviteToken ? buildInvitationAcceptPath(inviteToken) : undefined)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    navigate(returnTo ?? '/workspaces', { replace: true })
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

    if (!firstName.trim()) {
      setFormError('First name is required')
      return
    }
    if (!lastName.trim()) {
      setFormError('Last name is required')
      return
    }
    if (!email.trim()) {
      setFormError('Email is required')
      return
    }
    if (!password) {
      setFormError('Password is required')
      return
    }

    try {
      await registerMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        redirectTo: returnTo,
        inviteToken: inviteToken ?? undefined,
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  const displayError =
    formError ?? (registerMutation.isError ? registerMutation.error.message : null)

  return (
    <AuthLayout>
      <AuthHeroHeader />

      <div>
        <h2 className="text-2xl font-semibold text-foreground">Create account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Register to join the ptrack application
        </p>
      </div>

      {displayError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {displayError}
        </div>
      )}

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                First name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={registerMutation.isPending}
                required
                autoComplete="given-name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                Last name
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={registerMutation.isPending}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button type="submit" disabled={registerMutation.isPending} className="w-full">
          {registerMutation.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to={inviteToken ? `/login?invite=${encodeURIComponent(inviteToken)}` : '/login'}
          state={returnTo ? { from: returnTo } : undefined}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>

      <div className="text-center text-xs text-muted-foreground">© 2026 FractalHive</div>
    </AuthLayout>
  )
}

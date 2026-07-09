import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthHeroHeader, AuthLayout, AuthSessionLoader } from '@/components/auth/AuthLayout'
import { Button } from '@/shared/components/ui/button'
import {
  buildInvitationAcceptPath,
  resolveInviteToken,
  useAcceptInvitation,
  useInvitationPreview,
} from '@/hooks/useInvitations'
import { useAuth } from '@/hooks/useAuth'

function formatRole(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

function formatExpiresAt(expiresAt: string) {
  return new Date(expiresAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams()
  const token = resolveInviteToken(searchParams)
  const { isAuthenticated, initializing, user } = useAuth()
  const previewQuery = useInvitationPreview(token)
  const acceptMutation = useAcceptInvitation()
  const hasAttemptedAccept = useRef(false)

  const preview = previewQuery.data
  const isInvalid =
    !token ||
    previewQuery.isError ||
    (preview && (preview.status !== 'PENDING' || preview.expired))

  useEffect(() => {
    if (hasAttemptedAccept.current) return
    if (!token || initializing || !isAuthenticated || !preview) return
    if (preview.status !== 'PENDING' || preview.expired) return

    const loggedInEmail = user?.email?.trim().toLowerCase()
    const invitedEmail = preview.inviteeEmail.trim().toLowerCase()
    if (!loggedInEmail || loggedInEmail !== invitedEmail) return

    hasAttemptedAccept.current = true
    acceptMutation.mutate(token)
  }, [acceptMutation, initializing, isAuthenticated, preview, token, user?.email])

  if (!token) {
    return (
      <AuthLayout>
        <AuthHeroHeader title="Invalid invitation" subtitle="This invitation link is missing a token." />
        <Button asChild className="w-full">
          <Link to="/login">Go to sign in</Link>
        </Button>
      </AuthLayout>
    )
  }

  if (previewQuery.isLoading || initializing) {
    return (
      <AuthSessionLoader
        message={
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading invitation…
          </>
        }
      />
    )
  }

  if (previewQuery.isError || !preview) {
    return (
      <AuthLayout>
        <AuthHeroHeader
          title="Invitation not found"
          subtitle="This link may be invalid or has already been used."
        />
        <Button asChild className="w-full">
          <Link to="/login">Go to sign in</Link>
        </Button>
      </AuthLayout>
    )
  }

  if (isInvalid) {
    const subtitle =
      preview.status !== 'PENDING'
        ? 'This invitation has already been accepted or revoked.'
        : 'This invitation has expired.'

    return (
      <AuthLayout>
        <AuthHeroHeader title="Invitation unavailable" subtitle={subtitle} />
        <Button asChild className="w-full">
          <Link to={isAuthenticated ? '/workspaces' : '/login'}>
            {isAuthenticated ? 'Go to workspaces' : 'Go to sign in'}
          </Link>
        </Button>
      </AuthLayout>
    )
  }

  const acceptPath = buildInvitationAcceptPath(token)
  const loginPath = `/login?invite=${encodeURIComponent(token)}`
  const registerPath = `/register?invite=${encodeURIComponent(token)}`
  const loggedInEmail = user?.email?.trim().toLowerCase()
  const invitedEmail = preview.inviteeEmail.trim().toLowerCase()
  const emailMismatch =
    isAuthenticated && loggedInEmail && loggedInEmail !== invitedEmail

  return (
    <AuthLayout>
      <AuthHeroHeader
        title="Workspace invitation"
        subtitle={`You've been invited to join ${preview.workspaceName}`}
      />

      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Workspace</span>
            <span className="font-medium text-foreground">{preview.workspaceName}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium text-foreground">{formatRole(preview.role)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Invited email</span>
            <span className="font-medium text-foreground">{preview.inviteeEmail}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Expires</span>
            <span className="font-medium text-foreground">{formatExpiresAt(preview.expiresAt)}</span>
          </div>
        </div>
      </div>

      {emailMismatch && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          You are signed in as {user?.email}, but this invitation was sent to {preview.inviteeEmail}.
          Sign in with the invited email to accept.
        </div>
      )}

      {!isAuthenticated ? (
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to={loginPath} state={{ from: acceptPath }}>
              Sign in to accept
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to={registerPath} state={{ from: acceptPath }}>
              Create account
            </Link>
          </Button>
        </div>
      ) : emailMismatch ? (
        <Button asChild className="w-full">
          <Link to={loginPath} state={{ from: acceptPath }}>
            Sign in with invited email
          </Link>
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {acceptMutation.isPending ? 'Accepting invitation…' : 'Preparing your workspace…'}
        </div>
      )}
    </AuthLayout>
  )
}

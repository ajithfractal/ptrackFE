import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { PasswordInput } from '@/shared/components/ui/password-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { getInitials, resolveAvatarUrl } from '@/lib/avatar'
import { useChangePassword } from '@/hooks/useAuth'
import { useProfile, useUpdateBio, useUploadAvatar } from '@/hooks/useProfile'

type ProfileTab = 'profile' | 'password'

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</p>
  )
}

function BadgeList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">None</p>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function ProfileSectionContent({
  profile,
  uploadMutation,
  bioMutation,
}: {
  profile: NonNullable<ReturnType<typeof useProfile>['data']>
  uploadMutation: ReturnType<typeof useUploadAvatar>
  bioMutation: ReturnType<typeof useUpdateBio>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bio, setBio] = useState(profile.bio ?? '')

  useEffect(() => {
    setBio(profile.bio ?? '')
  }, [profile.bio])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    await uploadMutation.mutateAsync(file).catch(() => {
      /* onError in hook shows toast */
    })
  }

  const handleBioSave = async () => {
    await bioMutation.mutateAsync(bio).catch(() => {
      /* onError in hook shows toast */
    })
  }

  const avatarSrc = resolveAvatarUrl(profile.avatarUrl)
  const initials = getInitials(profile.name, profile.email)
  const bioDirty = bio !== (profile.bio ?? '')

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={profile.name}
              className="h-20 w-20 rounded-full border-2 border-background object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-background bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
              {initials}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
            aria-label="Upload profile photo"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadMutation.isPending ? 'Uploading…' : 'Change photo'}
            </Button>
            <span className="text-xs text-muted-foreground">JPEG, PNG, WebP, or GIF · 2 MB max</span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-5">
        <SectionLabel>Bio</SectionLabel>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Tell others a little about yourself…"
          className="w-full max-w-2xl resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex max-w-2xl items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{bio.length}/1000</p>
          <Button type="button" size="sm" disabled={!bioDirty || bioMutation.isPending} onClick={handleBioSave}>
            {bioMutation.isPending ? 'Saving…' : 'Save bio'}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <SectionLabel>Roles</SectionLabel>
          <BadgeList items={profile.roles} />
        </div>
        <div className="space-y-1.5">
          <SectionLabel>Permissions</SectionLabel>
          <BadgeList items={profile.permissions} />
        </div>
      </div>
    </div>
  )
}

function ChangePasswordSection() {
  const changePassword = useChangePassword()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!newPassword) {
      setFormError('Please enter a new password.')
      return
    }

    if (newPassword.length < 8) {
      setFormError('New password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    await changePassword
      .mutateAsync(newPassword)
      .then(() => {
        setNewPassword('')
        setConfirmPassword('')
      })
      .catch(() => {
        /* onError in hook shows toast */
      })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-4 max-w-md space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="text-sm font-medium text-foreground">
            New password
          </label>
          <PasswordInput
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Confirm new password
          </label>
          <PasswordInput
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <Button type="submit" size="sm" disabled={changePassword.isPending}>
          {changePassword.isPending ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  )
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  const { data: profile, isLoading, error } = useProfile()
  const uploadMutation = useUploadAvatar()
  const bioMutation = useUpdateBio()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>
  }

  if (error || !profile) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : 'Failed to load profile'}
      </p>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile"
        description="Manage your profile photo and bio. Other details are managed by your organization."
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileTab)}>
        <TabsList>
          <TabsTrigger value="profile" className="px-4">
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="px-4">
            Change password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileSectionContent
            profile={profile}
            uploadMutation={uploadMutation}
            bioMutation={bioMutation}
          />
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <ChangePasswordSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

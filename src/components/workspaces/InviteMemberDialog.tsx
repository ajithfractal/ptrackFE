import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { addDays, DatePicker, toEndOfDayIso } from '@/shared/components/ui/date-picker'
import { Input } from '@/shared/components/ui/input'
import { useInviteMember } from '@/hooks/useWorkspaces'
import type { Workspace, WorkspaceRole } from '@/types'

const inviteSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum(['ADMIN', 'MEMBER']),
})

type InviteFormValues = z.infer<typeof inviteSchema>

const INVITE_ROLES: { value: Extract<WorkspaceRole, 'ADMIN' | 'MEMBER'>; label: string }[] = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'ADMIN', label: 'Admin' },
]

type InviteMemberDialogProps = {
  workspace: Workspace | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function InviteMemberDialog({ workspace, open, onOpenChange }: InviteMemberDialogProps) {
  const inviteMutation = useInviteMember()
  const [expiresAt, setExpiresAt] = useState<Date>(() => addDays(new Date(), 7))

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'MEMBER' },
  })

  useEffect(() => {
    if (open) {
      form.reset({ email: '', role: 'MEMBER' })
      setExpiresAt(addDays(new Date(), 7))
    }
  }, [open, form])

  const handleSubmit = async (values: InviteFormValues) => {
    if (!workspace) return

    await inviteMutation
      .mutateAsync({
        workspaceId: workspace.id,
        data: {
          email: values.email,
          role: values.role,
          expiresAt: toEndOfDayIso(expiresAt),
        },
      })
      .then(() => onOpenChange(false))
      .catch(() => {
        /* onError in hook shows toast */
      })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">Invite member</h2>
        {workspace && (
          <p className="mt-1 text-sm text-muted-foreground">
            Send an invitation to join <span className="font-medium text-foreground">{workspace.name}</span>.
          </p>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              autoComplete="email"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="invite-role" className="text-sm font-medium text-foreground">
              Role
            </label>
            <select
              id="invite-role"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              {...form.register('role')}
            >
              {INVITE_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Invitation expires</label>
            <DatePicker
              value={expiresAt}
              onChange={(date) => date && setExpiresAt(date)}
              placeholder="Select expiry date"
              minDate={new Date()}
            />
            <p className="text-xs text-muted-foreground">Invite expires at the end of the selected day.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending || !workspace}>
              {inviteMutation.isPending ? 'Sending…' : 'Send invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

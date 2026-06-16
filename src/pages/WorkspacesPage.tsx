import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import PageHeader from '../components/common/PageHeader'
import { useCreateWorkspace, useWorkspaces } from '../hooks/useWorkspaces'
import { nameToSlug } from '../lib/slug'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be at most 255 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase alphanumeric with hyphens (e.g. acme-corp)'
    ),
})

type FormValues = z.infer<typeof schema>

export default function WorkspacesPage() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const createMutation = useCreateWorkspace()
  const [createOpen, setCreateOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '' },
  })

  const name = form.watch('name')

  useEffect(() => {
    if (!slugTouched) {
      form.setValue('slug', nameToSlug(name), { shouldValidate: true })
    }
  }, [name, slugTouched, form])

  const handleCreate = async (values: FormValues) => {
    await createMutation.mutateAsync({ name: values.name, slug: values.slug }).then(() => {
      toast.success('Workspace created')
      form.reset()
      setSlugTouched(false)
      setCreateOpen(false)
    }).catch(() => { /* onError in hook shows toast */ })
  }

  return (
    <div>
      <PageHeader
        title="Workspaces"
        description="Manage your workspaces and teams."
        action={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New workspace
          </button>
        }
      />

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">Create workspace</h2>

            <form onSubmit={form.handleSubmit(handleCreate)} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="My Workspace"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="slug" className="text-sm font-medium text-foreground">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  placeholder="my-workspace"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                  {...form.register('slug', {
                    onChange: () => setSlugTouched(true),
                  })}
                />
                {form.formState.errors.slug && (
                  <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false)
                    form.reset()
                    setSlugTouched(false)
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      {!isLoading && workspaces?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No workspaces yet. Create one to get started.
        </p>
      )}

      {workspaces && workspaces.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {workspaces.map((workspace) => (
            <li key={workspace.id} className="px-4 py-3">
              <p className="font-medium text-foreground">{workspace.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{workspace.slug}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

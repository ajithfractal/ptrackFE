import logo from '@/assets/FractalHive_Logo.svg'

type AuthHeroHeaderProps = {
  title?: string
  subtitle?: string
}

export function AuthHeroHeader({
  title = 'P-Track',
  subtitle = 'Project Tracker by FractalHive',
}: AuthHeroHeaderProps) {
  return (
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
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-screen justify-center bg-background font-sans text-base leading-normal text-foreground antialiased">
      <section className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">{children}</div>
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

export function AuthSessionLoader({ message }: { message: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{message}</div>
    </div>
  )
}

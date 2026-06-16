import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthBootstrap } from '@/components/auth/AuthBootstrap'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
})

type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap>{children}</AuthBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

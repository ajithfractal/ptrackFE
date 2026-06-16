/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_API_BASE_URL: string
  readonly VITE_APPLICATION_CODE?: string
  readonly VITE_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

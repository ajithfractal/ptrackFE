/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APPLICATION_CODE?: string
  readonly VITE_API_TOKEN?: string
  readonly VITE_NOTIFICATION_ENGINE_APP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

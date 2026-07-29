/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PRIMEREACT_LICENSE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

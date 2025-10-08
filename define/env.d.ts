/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_SERVER_SECRET?: string; 
  readonly SERVER_SECRET?: string; 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
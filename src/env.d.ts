interface ImportMetaEnv {
  readonly NEXT_PUBLIC_CONVEX_URL: string;
  readonly NEXT_PUBLIC_CONVEX_SITE_URL: string;
  readonly NEXT_PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

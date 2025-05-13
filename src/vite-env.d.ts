
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_I18N_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      common: typeof import('./i18n/locales/en/common.json');
      home: typeof import('./i18n/locales/en/home.json');
      hotels: typeof import('./i18n/locales/en/hotels.json');
      navigation: typeof import('./i18n/locales/en/navigation.json');
      seo: typeof import('./i18n/locales/en/seo.json');
    }
  }
}

// Make sure the React types are properly extended for i18next
/// <reference path="./types/react-i18next.d.ts" />

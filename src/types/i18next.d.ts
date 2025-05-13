
// Type definitions for i18next methods not included in the default types
declare module 'i18next' {
  import { InitOptions, Resource, TFunction } from 'i18next';

  export interface i18n {
    use(module: any): i18n;
    language: string;
    changeLanguage(lng: string): Promise<TFunction>;
    init(options: InitOptions): Promise<i18n>;
  }

  // Re-export the existing types
  export * from 'i18next';
  
  // Make the default export compatible with our extended interface
  declare const i18next: i18n;
  export default i18next;
}

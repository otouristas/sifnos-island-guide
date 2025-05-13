
declare module 'i18next-browser-languagedetector' {
  import { Module, DetectorOptions } from 'i18next';
  
  export interface DetectorOptions {
    order?: string[];
    lookupQuerystring?: string;
    lookupCookie?: string;
    lookupLocalStorage?: string;
    lookupSessionStorage?: string;
    lookupFromPathIndex?: number;
    lookupFromSubdomainIndex?: number;
    caches?: string[];
    excludeCacheFor?: string[];
    checkWhitelist?: boolean;
    cookieExpirationDate?: Date;
    cookieDomain?: string;
  }
  
  export default class LanguageDetector implements Module {
    constructor(services?: any, options?: DetectorOptions);
    type: 'languageDetector';
    init(services: any, options?: DetectorOptions): void;
    detect(): string | undefined;
    cacheUserLanguage(lng: string): void;
  }
}

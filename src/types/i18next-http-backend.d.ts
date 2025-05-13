
declare module 'i18next-http-backend' {
  import { BackendModule, Services, InitOptions, Resource } from 'i18next';

  export interface HttpBackendOptions {
    loadPath?: string;
    addPath?: string;
    allowMultiLoading?: boolean;
    parse?(data: any, languages?: string | string[], namespaces?: string | string[]): Resource;
    stringify?(data: object, languages?: string | string[], namespaces?: string | string[]): string;
    parsePayload?(namespace: string, key: string, fallbackValue?: string): object;
    request?(options: object, url: string, payload: object, callback: (error: any, response: any) => void): void;
    reloadInterval?: number | false;
    customHeaders?: object;
    queryStringParams?: object;
    crossDomain?: boolean;
  }

  export default class Backend implements BackendModule {
    constructor(services: Services, options?: HttpBackendOptions);
    init(services: Services, options?: HttpBackendOptions & InitOptions): void;
    read(language: string, namespace: string, callback: (error: any, data: any) => void): void;
    create(languages: string[], namespace: string, key: string, fallbackValue: string): void;
    type: 'backend';
  }
}


declare module 'i18next-http-backend' {
  import { BackendModule, Services, ReadCallback } from 'i18next';
  
  export interface BackendOptions {
    loadPath?: string;
    addPath?: string;
    allowMultiLoading?: boolean;
    parse?(data: any): any;
    parsePayload?(namespace: string, key: string, fallbackValue: string): any;
    format?(value: string, format: string): string;
    request?(options: any, url: string, payload: any, callback: RequestCallback): void;
  }
  
  export interface RequestCallback {
    (error: any, response: any): void;
  }
  
  export default class Backend implements BackendModule<BackendOptions> {
    constructor(services?: Services, options?: BackendOptions);
    init(services: Services, options?: BackendOptions): void;
    read(language: string, namespace: string, callback: ReadCallback): void;
    create?(language: string, namespace: string, key: string, fallbackValue: string): void;
    type: 'backend';
  }
}

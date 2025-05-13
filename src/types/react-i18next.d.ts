
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend the ReactI18NextChildren type to be compatible with ReactNode
  export interface ReactI18NextChildren extends ReactNode {}
}

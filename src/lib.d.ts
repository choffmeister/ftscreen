declare module 'body-scroll-lock' {
  export function enableBodyScroll(element: any): void
  export function disableBodyScroll(element: any): void
  export function clearAllBodyScrollLocks(): void
}

declare module '*.i18n' {
  import { UseTranslationResponse } from 'react-i18next'
  export const namespace: string
  export const translations: any
  export const useTranslation: () => UseTranslationResponse
}

declare module '*.png'
declare module '*.svg'
declare module '*.md' {
  export default string
}

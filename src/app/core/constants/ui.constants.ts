export const UI = {
  DEFAULT_PAGE_SIZE: 20,
  SUPPORTED_LOCALES: ['he-IL', 'en-US'] as readonly string[],
  DEFAULT_LOCALE: 'he-IL',
  RTL_LANGUAGES: ['he'] as readonly string[],
  MOBILE_BREAKPOINT: 480,
  TABLET_BREAKPOINT: 768,
  DESKTOP_BREAKPOINT: 1024,
} as const;

export type SupportedLocale = typeof UI.SUPPORTED_LOCALES[number];

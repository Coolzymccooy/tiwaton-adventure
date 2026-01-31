let cachedLogo: string | null | undefined;

export const getLogoUrl = (): string | null => {
  if (cachedLogo !== undefined) return cachedLogo;
  try {
    cachedLogo = new URL('/logo-tw.png', import.meta.url).href;
  } catch {
    cachedLogo = null;
  }
  return cachedLogo;
};

export const hasCustomLogo = () => Boolean(getLogoUrl());

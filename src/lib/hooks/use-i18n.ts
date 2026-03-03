/**
 * i18n hooks — uses react-i18next directly.
 */
import { useTranslation } from 'react-i18next';

export function useTranslate() {
  const { t } = useTranslation();
  return t;
}

export function useGetLocale() {
  const { i18n } = useTranslation();
  return () => i18n.language;
}

export function useSetLocale() {
  const { i18n } = useTranslation();
  return (lang: string) => i18n.changeLanguage(lang);
}

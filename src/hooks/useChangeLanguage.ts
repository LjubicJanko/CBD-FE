import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();

  const selectedLanguage = useMemo(
    () => i18n.language || window.localStorage.i18nextLng,
    [i18n.language]
  );

  const changeLanguage = useCallback(
    (value: string) => {
      i18n.changeLanguage(value);
    },
    [i18n]
  );

  return { selectedLanguage, changeLanguage };
};

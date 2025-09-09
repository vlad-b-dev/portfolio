import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const modules = import.meta.glob('./locales/**/*.json', { eager: true });

type Resources = Record<string, Record<string, any>>;
const resources: Resources = Object.entries(modules).reduce((acc, [path, module]) => {
  const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!match) return acc;
  const [, lng, ns] = match;
  acc[lng] = acc[lng] || {};
  acc[lng][ns] = (module as any).default ?? module;
  return acc;
}, {} as Resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;

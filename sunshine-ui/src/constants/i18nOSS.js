import i18nOSS from 'i18next';
import XHR from 'i18next-xhr-backend'; // https://github.com/i18next/i18next-xhr-backend
import LngDetector from 'i18next-browser-languagedetector'; // https://github.com/i18next/i18next-browser-languageDetector

export default () => {
  i18nOSS
    .use(LngDetector)
    .use(XHR)
    .init({
      fallbackLng: 'en',
      //lng: 'en', // default language
      load: 'languageOnly',
      ns: ['translations', 'privacy', 'termsofuse', 'serverMessages', 'tooltips','landingPage','operatorsPage'],
      interpolation: {prefix: '{{', suffix: '}}'},
      detection: {},
      backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: {
        //wait: true,
        useSuspense: true,
        withRef: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default',
        translateFuncName: 't',
        useSuspense: false
      }
    }, function(err) {
      if (err) {
        console.warn(err); // eslint-disable-line no-console
      }
    });
  return i18next;
};

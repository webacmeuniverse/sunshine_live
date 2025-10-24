import { useStore } from 'react-redux';

import { countriesCountryCodes } from '../constants/countries';

function _useLocale(language, country) {
  const store = useStore();

  if (!language) {
    const state = store.getState();
    return state.user.language;
  }

  const c = language === 'english' ? 'England' : country;
  const loc = c in countriesCountryCodes ? countriesCountryCodes[c].toLowerCase() : 'en';
  return loc;
}

export default _useLocale;

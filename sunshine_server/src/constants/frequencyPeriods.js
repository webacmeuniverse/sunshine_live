import i18n from 'i18next';

export const frequencyPeriods = (t, options = {}) => {
  const { count, short, disableYearsOptions } = options;

  if (short) {
    if (disableYearsOptions) {
      return [
        { value: 'm', label: t('frequencyPeriods.m_plural') },
      ];
    }
    return [
      { value: 'm', label: t('frequencyPeriods.m_plural') },
      { value: 'y', label: t('frequencyPeriods.y_plural') },
      { value: 'ys', label: t('frequencyPeriods.ysShort') },
      { value: 'ya', label: t('frequencyPeriods.yaShort') },
      { value: 'yw', label: t('frequencyPeriods.ywShort') },
      { value: 'ysp', label: t('frequencyPeriods.yspShort') },
    ];
  }
  if (disableYearsOptions) {
    return [
      { value: '1-m', label: t('frequencyPeriods.m', { count }) },
    ];
  }
  return [
    { value: '1-m', label: t('frequencyPeriods.m', { count }) },
    { value: '1-y', label: t('frequencyPeriods.y', { count }) },
    { value: '1-ys', label: t('frequencyPeriods.ys', { count }) },
    { value: '1-ya', label: t('frequencyPeriods.ya', { count }) },
    { value: '1-yw', label: t('frequencyPeriods.yw', { count }) },
    { value: '1-ysp', label: t('frequencyPeriods.ysp', { count }) },
  ];
};

export function getFrequencyPeriod(value, defaults, translateFn) {
  let t = translateFn;
  if (!t) {
    t = (w) => i18n.t(w);
  }

  const f = value.toLowerCase();
  let m = f.match(/(\d+)-([ymspwa]{1,3})/);
  if (m) {
    const count = parseInt(m[1], 10);
    return { value, count, key: m[2], label: t(`frequencyPeriods.${m[2]}`, { count }) };
  }
  // NOTE @edimov: All below checks are for backwards
  // compatibility of frequency periods. Once confirmed
  // backend service won't have support for these string
  // labels - code can be removed.
  if (f.indexOf('annual') === 0) {
    if (f.indexOf('summer') > -1) {
      return { value: '1-ys', count: 1, key: 'ys', label: t('translations:frequencyPeriods.ys') };
    }
    if (f.indexOf('winter') > -1) {
      return { value: '1-yw', count: 1, key: 'yw', label: t('translations:frequencyPeriods.yw') };
    }
    if (f.indexOf('spring') > -1) {
      return { value: '1-ysp', count: 1, key: 'ysp', label: t('translations:frequencyPeriods.ysp') };
    }
    if (f.indexOf('autumn') > -1) {
      return { value: '1-ya', count: 1, key: 'ya', label: t('translations:frequencyPeriods.ya') };
    }
    return { value: '1-y', count: 1, key: 'y', label: t('translations:frequencyPeriods.y') };
  }
  if (f.indexOf('month') === 0) {
    return { value: '1-m', count: 1, key: 'm', label: t('translations:frequencyPeriods.m') };
  }
  m = f.match(/(\d)\smonths/);
  if (m) {
    const count = parseInt(m[1], 10);
    return { value: `${m[1]}-m`, count, key: 'm', label: t('translations:frequencyPeriods.m', { count }) };
  }
  m = f.match(/(\d+)\syears/);
  if (m) {
    const count = parseInt(m[1], 10);
    return { value: `${count}-y`, count, key: 'y', label: t('translations:frequencyPeriods.y', { count }) };
  }
  return { value, count: -1, key: '', label: '', ...defaults };
}

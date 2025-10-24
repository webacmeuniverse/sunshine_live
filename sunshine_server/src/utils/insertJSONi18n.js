const defaultLocs = { en: '', pl: '', ro: '', au: '', lv: '', bg: '' };

function _insert(src, str, loc, { initDefault = false }) {
  try {
    const parsed = JSON.parse(src);
    parsed[loc] = str;

    return JSON.stringify(parsed);
  } catch {
    if (initDefault) {
      return JSON.stringify({ ...defaultLocs, [loc]: str });
    }
    return str;
  }
}

export default _insert;

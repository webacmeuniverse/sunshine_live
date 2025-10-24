import { parseAddress } from '../components/asset/utils';

export default function sortByKey(items, key, dir = 'asc') {
  if (!items) {
    return items;
  }

  if (key === 'address') {
    return items.sort((_a, _b) => {
      const { a, b } = pos(_a, _b, dir);

      if (parseAddress(a.data[key]) < parseAddress(b.data[key])) {
        return -1;
      }
      if (parseAddress(a.data[key]) > parseAddress(b.data[key])) {
        return 1;
      }
      return 0;
    });
  }

  return items.sort((_a, _b) => {
    const { a, b } = pos(_a, _b, dir);

    if (a.data[key] < b.data[key]) {
      return -1;
    }
    if (a.data[key] > b.data[key]) {
      return 1;
    }
    return 0;
  });
}

function pos(a, b, dir) {
  if (dir === 'asc') {
    return { a, b };
  }
  return { a: b, b: a };
}

export function query(o) {
  const q = [];

  const qKeys = Object.keys(o);
  for (const i in qKeys) {
    const k = qKeys[i];
    const v = o[k];

    if (v === null || v === '') {
      continue;
    }

    if (Array.isArray(v)) {
      for (const vi in v) {
        q.push(`${k}=${v[vi]}`);
      }
    } else {
      q.push(`${k}=${v}`);
    }
  }

  return q.join('&');
}

export function parseQuery(q, queryKindsMap) {
  const o = {};
  if (!q) {
    return o;
  }
  const m = q.match(/^\?(.*)$/);
  if (!m) {
    return o;
  }
  const pairs = m[1].split('&');
  for (let i = 0; i < pairs.length; i++) {
    const kv = pairs[i].split('=');
    const k = kv[0];
    if (o[k]) {
      if (Array.isArray(o[k])) {
        o[k].push(kv[1]);
        continue;
      }
      o[k] = [o[k], kv[1]];
      continue;
    }

    const value = queryKindsMap?.[kv[0]] ? queryKindsMap[kv[0]][kv[1]] : kv[1];
    o[kv[0]] = value;
  }

  return o;
}

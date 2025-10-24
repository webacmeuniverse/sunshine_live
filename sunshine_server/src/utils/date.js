/**
 * get attempts to parse date string into Date
 * object. The platform uses dd.MM.YYYY EES date
 * format, which is not ISO 8601 compliant.
 *
 * @param {*} d - Date to parse.
 *
 * @returns {Date | null} - The requested value as Date object
 * or null on failure to parse.
 */
export function get(d) {
  if (!d) {
    return null;
  }
  if (typeof d !== 'string') {
    return d;
  }
  if (d.indexOf('.') < 0) {
    try {
      return new Date(d);
    } catch {
      return null;
    }
  }
  const parts = d.split('.');
  return new Date(Number(parts[2]), parts[1] - 1, Number(parts[0]));
}

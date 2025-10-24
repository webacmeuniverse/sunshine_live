function _parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

export default _parseJSON;

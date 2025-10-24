export function download(text, options) {
  const {
    filename,
    type,
  } = options;

  const blob = new Blob([ text ], {
    type: `${type};charset=utf-8`,
  });

  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

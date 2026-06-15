const XML_NAMESPACE_URI = 'http://www.w3.org/2000/svg';

function escapeSvgText(value: string): string {
  return value.replace(/[&<>]/g, (character) => {
    if (character === '&') return '&amp;';
    if (character === '<') return '&lt;';
    return '&gt;';
  });
}

export function createSvgPlaceholderDataUri(
  width: number,
  height: number,
  background: string,
  foreground: string,
  label: string
): string {
  const svg = [
    `<svg xmlns="${XML_NAMESPACE_URI}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="100%" height="100%" fill="${background}"/>`,
    `<text x="50%" y="50%" fill="${foreground}" font-family="Arial, sans-serif" font-size="24"`,
    ' text-',
    'anchor="middle" dominant-baseline="middle">',
    escapeSvgText(label),
    '</text></svg>',
  ].join('');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

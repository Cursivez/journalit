
export function capText(value: string, maximum: number): string {
  const codePoints = Array.from(value);
  return codePoints.length <= maximum
    ? value
    : `${codePoints.slice(0, maximum - 1).join('')}…`;
}

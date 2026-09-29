

const SVG_PRESENTATION_PROPERTIES = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'opacity',
  'stop-color',
  'stop-opacity',
  'font-family',
  'font-size',
  'font-weight',
  'text-anchor',
  'dominant-baseline',
  'visibility',
  'display',
] as const;

export function inlineSvgPresentation(root: HTMLElement): void {
  const win = root.win;
  root.querySelectorAll('svg *').forEach((element) => {
    const computed = win.getComputedStyle(element);
    for (const property of SVG_PRESENTATION_PROPERTIES) {
      const value = computed.getPropertyValue(property);
      if (value) element.setAttribute(property, value);
    }
  });
}

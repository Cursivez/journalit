import type React from 'react';

type ChartMarkElement = SVGPathElement | SVGRectElement | SVGGElement;

const CHART_MARK_SELECTOR = '[data-journalit-chart-mark="true"]';


export function handleRovingChartMarkKeyDown<Element extends ChartMarkElement>(
  event: React.KeyboardEvent<Element>,
  activate: () => void
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    activate();
    return;
  }

  const ownerSvg = event.currentTarget.ownerSVGElement;
  if (!ownerSvg) return;

  const marks = Array.from(
    ownerSvg.querySelectorAll<ChartMarkElement>(CHART_MARK_SELECTOR)
  );
  const currentIndex = marks.indexOf(event.currentTarget);
  if (currentIndex === -1 || marks.length < 2) return;

  let nextIndex: number | null = null;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % marks.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + marks.length) % marks.length;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = marks.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  event.stopPropagation();
  const nextMark = marks[nextIndex];
  event.currentTarget.tabIndex = -1;
  nextMark.tabIndex = 0;
  nextMark.focus();
}

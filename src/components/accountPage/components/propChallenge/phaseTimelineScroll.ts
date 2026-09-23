const SELECTED_PHASE_SELECTOR =
  '.journalit-prop-challenge-phase-step.is-selected';

export function revealSelectedPhaseStep(timeline: HTMLElement): void {
  const selectedStep = timeline.querySelector<HTMLElement>(
    SELECTED_PHASE_SELECTOR
  );
  if (!selectedStep) return;

  const visibleLeft = timeline.scrollLeft;
  const visibleRight = visibleLeft + timeline.clientWidth;
  const stepLeft = selectedStep.offsetLeft;
  const stepRight = stepLeft + selectedStep.offsetWidth;

  if (stepLeft < visibleLeft) {
    timeline.scrollLeft = stepLeft;
  } else if (stepRight > visibleRight) {
    timeline.scrollLeft = stepRight - timeline.clientWidth;
  }
}

export function observeSelectedPhaseStep(timeline: HTMLElement): () => void {
  const reveal = () => revealSelectedPhaseStep(timeline);
  reveal();
  const resizeObserver = new ResizeObserver(reveal);
  resizeObserver.observe(timeline);
  return () => resizeObserver.disconnect();
}



import { useEffect, useState } from 'react';
import { getModalGuideTargetElement } from './modalGuidePopover';

interface ModalGuideTargetState {
  targetRect: DOMRect | null;
  isWaitingForTarget: boolean;
}

export function useModalGuideTarget(
  selector: string | undefined,
  isActive: boolean
): ModalGuideTargetState {
  const [state, setState] = useState<ModalGuideTargetState>({
    targetRect: null,
    isWaitingForTarget: false,
  });

  useEffect(() => {
    if (!isActive) return;
    if (!selector) {
      setState({ targetRect: null, isWaitingForTarget: false });
      return;
    }
    const update = () => {
      const target = getModalGuideTargetElement(selector);
      setState({
        targetRect: target?.getBoundingClientRect() ?? null,
        isWaitingForTarget: !target,
      });
    };
    update();
    const interval = window.setInterval(update, 150);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isActive, selector]);

  return state;
}

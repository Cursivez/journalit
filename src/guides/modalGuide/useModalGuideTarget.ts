

import { useEffect, useState } from 'react';
import { getModalGuideTargetElement } from './modalGuidePopover';

interface ModalGuideTargetState {
  targetRect: DOMRect | null;
  isWaitingForTarget: boolean;
}

export function useModalGuideTarget(
  selector: string | undefined,
  isActive: boolean,
  doc: Document = window.activeDocument
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
      const target = getModalGuideTargetElement(selector, doc);
      setState({
        targetRect: target?.getBoundingClientRect() ?? null,
        isWaitingForTarget: !target,
      });
    };
    update();
    const ownerWindow = doc.defaultView;
    const interval = ownerWindow?.setInterval(update, 150);
    ownerWindow?.addEventListener('resize', update);
    ownerWindow?.addEventListener('scroll', update, true);
    return () => {
      ownerWindow?.clearInterval(interval);
      ownerWindow?.removeEventListener('resize', update);
      ownerWindow?.removeEventListener('scroll', update, true);
    };
  }, [isActive, selector, doc]);

  return state;
}

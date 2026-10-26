

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { t } from '../../lang/helpers';



interface FullscreenPortalProps {
  
  isOpen: boolean;

  
  children: ReactNode;

  
  portalId?: string;

  
  onClose: () => void;

  
  title?: string;

  
  className?: string;
}


export const FullscreenPortal: React.FC<FullscreenPortalProps> = ({
  isOpen,
  children,
  portalId = 'journalit-fullscreen-portal',
  onClose,
  title = t('image.viewer.description-default'),
  className = '',
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const onCloseRef = useRef(onClose);
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  
  
  
  
  useEffect(() => {
    
    const anchor = anchorRef.current;
    if (!isOpen || !anchor) return;

    
    
    
    const portalDocument = anchor.ownerDocument;
    const portalEl = portalDocument.body.createDiv({
      cls: 'journalit-fullscreen-portal-container',
      attr: { id: portalId },
    });
    setPortalContainer(portalEl);

    
    
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); 
        onCloseRef.current();
      }
    };

    
    
    const activeWindow = portalDocument.defaultView ?? window;
    activeWindow.addEventListener('keydown', handleKeyDown, true);

    return () => {
      activeWindow.removeEventListener('keydown', handleKeyDown, true);
      
      portalEl.remove();
      setPortalContainer(null);
    };
  }, [isOpen, portalId]);

  
  const anchor = (
    <span
      ref={anchorRef}
      className="journalit-fullscreen-portal-anchor"
      hidden
      aria-hidden="true"
    />
  );

  if (!isOpen || !portalContainer) {
    return anchor;
  }

  
  const overlayClassName = ['journalit-fullscreen-overlay', className]
    .filter(Boolean)
    .join(' ');

  
  const portal = ReactDOM.createPortal(
    <div
      className={overlayClassName}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="presentation"
    >
      
      <div className="journalit-fullscreen-overlay-ui">
        
        <div
          className="journalit-fullscreen-title"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          {title}
        </div>

        
        <button
          className="journalit-fullscreen-close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={t('image.viewer.close-aria')}
        >
          ×
        </button>
      </div>

      
      <div className="journalit-fullscreen-content-wrapper">
        <div className="journalit-fullscreen-content">{children}</div>
      </div>
    </div>,
    portalContainer
  );

  return (
    <>
      {anchor}
      {portal}
    </>
  );
};

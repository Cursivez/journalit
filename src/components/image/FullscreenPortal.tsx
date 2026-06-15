

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
  const portalElementRef = useRef<HTMLElement | null>(null);

  
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  
  useEffect(() => {
    if (!isOpen) return;

    

    let portalEl = window.activeDocument.getElementById(portalId);

    if (!portalEl) {
      portalEl = window.activeDocument.createElement('div');
      portalEl.id = portalId;
      portalEl.className = 'journalit-fullscreen-portal-container';
      window.activeDocument.body.appendChild(portalEl);
    }

    setPortalContainer(portalEl);
    portalElementRef.current = portalEl;

    
    
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); 
        onCloseRef.current();
      }
    };

    
    window.activeDocument.addEventListener('keydown', handleKeyDown, true);

    
    return () => {
      window.activeDocument.removeEventListener('keydown', handleKeyDown, true);

      
      
      if (!isOpenRef.current && portalEl && portalEl.parentNode) {
        window.setTimeout(() => {
          
          const currentPortal = window.activeDocument.getElementById(portalId);
          if (
            currentPortal &&
            currentPortal.parentNode &&
            currentPortal.childNodes.length === 0
          ) {
            try {
              currentPortal.parentNode.removeChild(currentPortal);
            } catch (error) {
              console.error(
                `[FullscreenPortal] Error removing portal element ${portalId}:`,
                error
              );
            }
          }
        }, 0); 
      }
    };
  }, [isOpen, portalId]);

  
  if (!isOpen || !portalContainer) {
    return null;
  }

  
  const overlayClassName = ['journalit-fullscreen-overlay', className]
    .filter(Boolean)
    .join(' ');

  
  return ReactDOM.createPortal(
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
};

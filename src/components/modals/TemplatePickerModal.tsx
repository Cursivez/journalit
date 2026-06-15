

import { App, Modal } from 'obsidian';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Check, Lock, Star } from '../shared/icons/ObsidianIcon';
import type { ReviewTemplate, TradeTemplate } from '../../types/reviewV2';
import { Button } from '../ui/Button';
import { t } from '../../lang/helpers';

type TemplateType = ReviewTemplate | TradeTemplate;

interface TemplatePickerModalProps {
  app: App;
  templates: TemplateType[];
  currentTemplateId?: string;
  defaultTemplateId?: string;
  title: string;
  onSelect: (template: TemplateType) => void | Promise<void>;
  onClose: () => void;
}

const TemplatePickerContent: React.FC<
  TemplatePickerModalProps & { onModalClose: () => void }
> = ({
  templates,
  currentTemplateId,
  defaultTemplateId,
  onSelect,
  onModalClose,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(() => {
    const index = templates.findIndex((t) => t.id === currentTemplateId);
    return index >= 0 ? index : 0;
  });
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (template: TemplateType) => {
      void onSelect(template);
      onModalClose();
    },
    [onSelect, onModalClose]
  );

  
  useEffect(() => {
    if (templates.length > 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex, templates.length]);

  
  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (templates.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % templates.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(
            (prev) => (prev - 1 + templates.length) % templates.length
          );
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(templates[focusedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onModalClose();
          break;
      }
    },
    [templates, focusedIndex, handleSelect, onModalClose]
  );

  
  useEffect(() => {
    listRef.current?.focus();
  }, []);

  if (templates.length === 0) {
    return (
      <div className="template-picker-content">
        <div className="template-picker-empty">
          {t('template-picker.empty')}
        </div>
        <div className="template-picker-buttons">
          <Button variant="secondary" onClick={onModalClose}>
            {t('template-picker.close')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-picker-content">
      <div
        ref={listRef}
        className="template-picker-list"
        tabIndex={0}
        onKeyDown={handleListKeyDown}
        role="listbox"
      >
        {templates.map((template, index) => {
          const isCurrent = template.id === currentTemplateId;
          const isDefault = template.id === defaultTemplateId;
          const isFocused = focusedIndex === index;

          return (
            <button
              key={template.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              tabIndex={-1}
              className={`template-picker-item ${isCurrent ? 'template-picker-item--current' : ''} ${isFocused ? 'template-picker-item--focused' : ''}`}
              onClick={() => handleSelect(template)}
              onMouseDown={() => listRef.current?.focus()}
              onMouseEnter={() => setFocusedIndex(index)}
              role="option"
              aria-selected={isCurrent}
            >
              <div className="template-picker-item-content">
                <span className="template-picker-item-name">
                  {template.name}
                </span>
                {template.isBuiltIn ? (
                  <span className="template-picker-item-builtin">
                    <Lock size={11} strokeWidth={2} />
                    {t('template-picker.built-in')}
                  </span>
                ) : (
                  <span className="template-picker-item-version">
                    V{template.version}
                  </span>
                )}
              </div>
              <div className="template-picker-badges">
                {isDefault && (
                  <span className="template-picker-badge template-picker-badge--default">
                    <Star size={10} strokeWidth={2.5} />
                    {t('template-picker.badge.default')}
                  </span>
                )}
                {isCurrent && (
                  <span className="template-picker-badge template-picker-badge--current">
                    <Check size={10} strokeWidth={2.5} />
                    {t('template-picker.badge.current')}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="template-picker-buttons">
        <Button variant="secondary" onClick={onModalClose}>
          {t('template-picker.cancel')}
        </Button>
      </div>
    </div>
  );
};

class TemplatePickerModal extends Modal {
  private props: TemplatePickerModalProps;
  private root: Root | null = null;

  constructor(props: TemplatePickerModalProps) {
    super(props.app);
    this.props = props;
    this.titleEl.setText(this.props.title);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('journalit-template-picker-modal');

    

    
    const container = contentEl.createDiv({ cls: 'template-picker-container' });

    
    this.root = createRoot(container);
    this.root.render(
      <TemplatePickerContent
        {...this.props}
        onModalClose={() => this.close()}
      />
    );
  }

  onClose(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.props.onClose();
  }
}


export function openTemplatePickerModal(
  app: App,
  templates: TemplateType[],
  currentTemplateId: string | undefined,
  title: string,
  onSelect: (template: TemplateType) => void | Promise<void>,
  defaultTemplateId?: string
): void {
  const modal = new TemplatePickerModal({
    app,
    templates,
    currentTemplateId,
    defaultTemplateId,
    title,
    onSelect,
    onClose: () => {},
  });
  modal.open();
}

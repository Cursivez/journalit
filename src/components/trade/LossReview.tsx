

import React, { useState, useEffect, useCallback } from 'react';
import {
  LossReviewSettings,
  LossReviewSection as SectionType,
} from '../../settings/types';
import { LossReviewData } from '../../services/backend/types';
import { Accordion } from '../shared/Accordion';
import { t } from '../../lang/helpers';

interface TradeReviewProps {
  settings: LossReviewSettings;
  data: LossReviewData | undefined;
  onUpdate: (data: LossReviewData) => void;
  filePath?: string;
}

type ReviewSectionData = LossReviewData['sections'][string];

interface TradeReviewSectionProps {
  section: SectionType;
  sectionData: ReviewSectionData | undefined;
  onCheckboxToggle: (sectionId: string, itemKey: string) => void;
  onTextAreaChange: (sectionId: string, value: string) => void;
}

interface MarkdownLine {
  key: string;
  content: string;
  isLast: boolean;
}

interface TradeReviewSectionErrorBoundaryProps {
  sectionId: string;
  children: React.ReactNode;
}

interface TradeReviewSectionErrorBoundaryState {
  hasError: boolean;
}

class TradeReviewSectionErrorBoundary extends React.Component<
  TradeReviewSectionErrorBoundaryProps,
  TradeReviewSectionErrorBoundaryState
> {
  state: TradeReviewSectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): TradeReviewSectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(
      `Error rendering trade review section ${this.props.sectionId}:`,
      error
    );
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function findClosingSingle(
  text: string,
  from: number,
  delimiter: '*' | '_'
): number {
  for (let j = from; j < text.length; j++) {
    if (text[j] !== delimiter) continue;

    
    if (text[j - 1] === delimiter || text[j + 1] === delimiter) continue;

    return j;
  }
  return -1;
}

function parseInlineMarkdownNodes(
  text: string,
  keyPrefix: string
): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let buf = '';
  let i = 0;
  let key = 0;

  const flush = () => {
    if (buf.length > 0) {
      out.push(buf);
      buf = '';
    }
  };

  while (i < text.length) {
    
    if (text.startsWith('**', i)) {
      const end =
        text.slice(i + 2).search(/\*\*/) === -1
          ? -1
          : i + 2 + text.slice(i + 2).search(/\*\*/);
      if (end !== -1) {
        flush();
        const inner = text.slice(i + 2, end);
        const localKey = key++;
        out.push(
          <strong key={`${keyPrefix}b-${localKey}`}>
            {parseInlineMarkdownNodes(inner, `${keyPrefix}b-${localKey}-`)}
          </strong>
        );
        i = end + 2;
        continue;
      }
    }

    
    if (text.startsWith('__', i)) {
      const end =
        text.slice(i + 2).search(/__/) === -1
          ? -1
          : i + 2 + text.slice(i + 2).search(/__/);
      if (end !== -1) {
        flush();
        const inner = text.slice(i + 2, end);
        const localKey = key++;
        out.push(
          <strong key={`${keyPrefix}b2-${localKey}`}>
            {parseInlineMarkdownNodes(inner, `${keyPrefix}b2-${localKey}-`)}
          </strong>
        );
        i = end + 2;
        continue;
      }
    }

    
    if (text[i] === '*' && text[i + 1] !== '*') {
      const end = findClosingSingle(text, i + 1, '*');
      if (end !== -1) {
        flush();
        const inner = text.slice(i + 1, end);
        const localKey = key++;
        out.push(
          <em key={`${keyPrefix}i-${localKey}`}>
            {parseInlineMarkdownNodes(inner, `${keyPrefix}i-${localKey}-`)}
          </em>
        );
        i = end + 1;
        continue;
      }
    }

    
    if (text[i] === '_' && text[i + 1] !== '_') {
      const end = findClosingSingle(text, i + 1, '_');
      if (end !== -1) {
        flush();
        const inner = text.slice(i + 1, end);
        const localKey = key++;
        out.push(
          <em key={`${keyPrefix}i2-${localKey}`}>
            {parseInlineMarkdownNodes(inner, `${keyPrefix}i2-${localKey}-`)}
          </em>
        );
        i = end + 1;
        continue;
      }
    }

    buf += text[i];
    i += 1;
  }

  flush();
  return out;
}

function getMarkdownLines(content: string): MarkdownLine[] {
  const lines = content.split('\n');
  return lines.map((line, index) => ({
    key: `line-${index}-${line}`,
    content: line,
    isLast: index === lines.length - 1,
  }));
}

function TradeReviewMarkdown({ content }: { content: string }) {
  const lines = getMarkdownLines(content);

  return (
    <>
      {lines.map((line) => (
        <React.Fragment key={line.key}>
          {parseInlineMarkdownNodes(line.content, `${line.key}-`)}
          {line.isLast ? null : <br />}
        </React.Fragment>
      ))}
    </>
  );
}

function TradeReviewSection({
  section,
  sectionData,
  onCheckboxToggle,
  onTextAreaChange,
}: TradeReviewSectionProps) {
  switch (section.type) {
    case 'header':
      return (
        <div className="trade-review-header">
          {section.title && (
            <h3>
              <TradeReviewMarkdown content={section.title} />
            </h3>
          )}
          {section.content && (
            <div className="trade-review-content">
              <TradeReviewMarkdown content={section.content} />
            </div>
          )}
        </div>
      );

    case 'checkbox': {
      const checkboxKey = section.content || section.id;
      const isChecked = sectionData?.checkboxes?.[checkboxKey] || false;

      return (
        <div className="trade-review-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onCheckboxToggle(section.id, checkboxKey)}
            />
            <span>
              <TradeReviewMarkdown content={section.content || ''} />
            </span>
          </label>
        </div>
      );
    }

    case 'checkboxList':
      return (
        <div className="trade-review-checkbox-list">
          {section.title && (
            <h3>
              <TradeReviewMarkdown content={section.title} />
            </h3>
          )}
          <div className="checkbox-items">
            {(section.items || []).map((item, index) => {
              const itemKey = `${section.id}-item-${index}`;
              const isChecked = sectionData?.checkboxes?.[itemKey] || false;

              return (
                <label key={itemKey} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onCheckboxToggle(section.id, itemKey)}
                  />
                  <span>
                    <TradeReviewMarkdown content={item} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case 'textarea': {
      const textValue = sectionData?.textAreas?.[section.id] || '';

      return (
        <div className="trade-review-textarea">
          {section.title && (
            <h3>
              <TradeReviewMarkdown content={section.title} />
            </h3>
          )}
          <textarea
            value={textValue}
            onChange={(e) => onTextAreaChange(section.id, e.target.value)}
            placeholder={section.placeholder || ''}
            rows={4}
            className="trade-review-textarea-input"
          />
        </div>
      );
    }

    default:
      return null;
  }
}

export const TradeReview: React.FC<TradeReviewProps> = React.memo(
  ({ settings, data, onUpdate }) => {
    
    const [reviewData, setReviewData] = useState<LossReviewData>(() => {
      
      const sections: LossReviewData['sections'] = {};
      settings.sections.forEach((section) => {
        sections[section.id] = {
          checkboxes: {},
          textAreas: {},
        };
      });

      
      if (data) {
        return {
          ...data,
          sections: {
            ...sections,
            ...data.sections,
          },
        };
      }

      
      return {
        sections,
        reviewed: false,
      };
    });

    
    useEffect(() => {
      setReviewData((prev) => {
        
        const updatedSections = { ...prev.sections };
        settings.sections.forEach((section) => {
          if (!updatedSections[section.id]) {
            updatedSections[section.id] = {
              checkboxes: {},
              textAreas: {},
            };
          }
        });

        
        if (data) {
          return {
            ...data,
            sections: {
              ...updatedSections,
              ...data.sections,
            },
          };
        }

        return {
          ...prev,
          sections: updatedSections,
        };
      });
    }, [data, settings.sections]);

    
    const updateData = useCallback(
      (updatedData: LossReviewData) => {
        
        setReviewData(updatedData);
        
        onUpdate(updatedData);
      },
      [onUpdate]
    );

    const handleCheckboxToggle = (sectionId: string, itemKey: string) => {
      const updatedData: LossReviewData = {
        ...reviewData,
        sections: {
          ...reviewData.sections,
          [sectionId]: {
            ...reviewData.sections[sectionId],
            checkboxes: {
              ...reviewData.sections[sectionId]?.checkboxes,
              [itemKey]: !reviewData.sections[sectionId]?.checkboxes?.[itemKey],
            },
          },
        },
      };

      
      updateData(updatedData);
    };

    const handleTextAreaChange = (sectionId: string, value: string) => {
      const updatedData: LossReviewData = {
        ...reviewData,
        sections: {
          ...reviewData.sections,
          [sectionId]: {
            ...reviewData.sections[sectionId],
            textAreas: {
              ...reviewData.sections[sectionId]?.textAreas,
              [sectionId]: value,
            },
          },
        },
      };

      
      updateData(updatedData);
    };

    
    if (!settings.enabled) {
      return null;
    }

    const accordionContent = (
      <div className="trade-review-sections">
        {settings.sections.map((section) => (
          <div className="trade-review-section" key={section.id}>
            <TradeReviewSectionErrorBoundary sectionId={section.id}>
              <TradeReviewSection
                section={section}
                sectionData={reviewData.sections[section.id]}
                onCheckboxToggle={handleCheckboxToggle}
                onTextAreaChange={handleTextAreaChange}
              />
            </TradeReviewSectionErrorBoundary>
          </div>
        ))}
      </div>
    );

    
    return (
      <div className="trade-review-container">
        <Accordion title={t('trade.review.title')} defaultExpanded={true}>
          {accordionContent}
        </Accordion>
      </div>
    );
  }
);

TradeReview.displayName = 'TradeReview';

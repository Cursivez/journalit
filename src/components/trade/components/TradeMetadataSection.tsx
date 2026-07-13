

import React from 'react';
import { TradeFormData } from '../../forms/trade/types';
import { TradeTemplate } from '../../../types/reviewV2';
import { t } from '../../../lang/helpers';
import {
  AlertTriangle,
  FlaskConical,
  Tag,
  User,
} from '../../shared/icons/ObsidianIcon';
import {
  getSetupLabelColor,
  getTagLabelColor,
  useTradeLabelColors,
  type TradeLabelColors,
} from '../../../contexts/TradeLabelColorContext';
import {
  getLabelColorClassName,
  getLabelColorForeground,
} from '../../../types/labelColor';
import { cssVars } from '../../../styles/inlineStylePolicy';

interface TradeMetadataSectionProps {
  data: Partial<TradeFormData>;
  onAccountClick: (accountIdOrName: string) => void | Promise<void>;
  config?: TradeTemplate['sections']['metadata'];
  labelColors?: TradeLabelColors;
  children?: React.ReactNode;
}

function normalizeLabel(label: string): string {
  return label.replace(/:\s*$/, '');
}

function MetadataRow({
  icon,
  label,
  variant,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: 'setup' | 'mistake' | 'tag';
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        variant
          ? `trade-context-row trade-context-row--${variant}`
          : 'trade-context-row'
      }
    >
      <div className="trade-context-label">
        <span className="trade-context-icon" aria-hidden="true">
          {icon}
        </span>
        <span>{normalizeLabel(label)}</span>
      </div>
      <div className="trade-context-values">{children}</div>
    </div>
  );
}

export const TradeMetadataSection: React.FC<TradeMetadataSectionProps> = ({
  data,
  onAccountClick,
  config,
  labelColors: providedLabelColors,
  children,
}) => {
  const contextLabelColors = useTradeLabelColors();
  const labelColors = providedLabelColors ?? contextLabelColors;
  const hasAccounts = data.account && data.account.length > 0;
  const hasCustomTags = data.customTags && data.customTags.length > 0;
  const hasSetups = data.setup && data.setup.length > 0;
  const mistakes = data.mistake || [];
  const hasMistakes = mistakes.length > 0;
  const mtComment =
    typeof data.mtComment === 'string' ? data.mtComment.trim() : '';
  const hasMTComment = mtComment.length > 0;

  
  const showAccounts = config?.showAccounts !== false;
  const showTags = config?.showTags !== false;
  const showSetups = config?.showSetups !== false;
  const showMistakes = config?.showMistakes !== false;
  const hasContextRows =
    (showAccounts && hasAccounts) ||
    (showTags && hasCustomTags) ||
    (showSetups && hasSetups) ||
    (showMistakes && hasMistakes);

  
  if (
    (!hasAccounts || !showAccounts) &&
    (!hasCustomTags || !showTags) &&
    !hasMTComment &&
    (!hasSetups || !showSetups) &&
    (!hasMistakes || !showMistakes) &&
    !children
  ) {
    return null;
  }

  return (
    <>
      {(hasContextRows || children) && (
        <div className="trade-context-section">
          <div className="trade-context-card">
            {showAccounts && hasAccounts && (
              <MetadataRow
                icon={<User size={18} />}
                label={t('trade.metadata.account')}
              >
                {(data.account || []).map((account) => (
                  <button
                    key={account}
                    type="button"
                    className="journalit-button account-tag trade-context-chip trade-context-chip--account"
                    onClick={() => void onAccountClick(account)}
                  >
                    {account}
                  </button>
                ))}
              </MetadataRow>
            )}

            {showSetups && hasSetups && (
              <MetadataRow
                icon={<FlaskConical size={18} />}
                label={t('trade.metadata.setups')}
                variant="setup"
              >
                {(data.setup || []).map((setup) => {
                  const color = getSetupLabelColor(labelColors.setups, setup);
                  return (
                    <span
                      key={setup}
                      className={`tag setup-tag trade-context-chip trade-context-chip--setup ${getLabelColorClassName(color)}`}
                      style={cssVars({
                        '--journalit-label-color': color,
                        '--journalit-label-foreground':
                          getLabelColorForeground(color),
                      })}
                    >
                      {setup}
                    </span>
                  );
                })}
              </MetadataRow>
            )}

            {showMistakes && hasMistakes && (
              <MetadataRow
                icon={<AlertTriangle size={18} />}
                label={t('trade.metadata.mistakes')}
                variant="mistake"
              >
                {mistakes.map((mistake) => (
                  <span
                    key={mistake}
                    className="tag mistake-tag trade-context-chip trade-context-chip--mistake"
                  >
                    {mistake}
                  </span>
                ))}
              </MetadataRow>
            )}

            {showTags && hasCustomTags && (
              <MetadataRow
                icon={<Tag size={18} />}
                label={t('tradelog.column.tags')}
                variant="tag"
              >
                {data.customTags!.map((tag) => {
                  const color = getTagLabelColor(labelColors.tags, tag);
                  return (
                    <span
                      key={tag}
                      className={`tag trade-context-chip trade-context-chip--tag ${getLabelColorClassName(color)}`}
                      style={cssVars({
                        '--journalit-label-color': color,
                        '--journalit-label-foreground':
                          getLabelColorForeground(color),
                      })}
                    >
                      {tag}
                    </span>
                  );
                })}
              </MetadataRow>
            )}

            {children}
          </div>
        </div>
      )}

      {hasMTComment && (
        <div className="trade-broker-metadata-section">
          <div className="details-card trade-broker-metadata-card">
            <div className="details-header">
              <h4>{t('trade.metadata.broker-comment')}</h4>
            </div>
            <div className="trade-broker-metadata-value">{mtComment}</div>
          </div>
        </div>
      )}
    </>
  );
};

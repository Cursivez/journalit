

import React from 'react';
import { tradeShareSectionProps } from '../../share/tradeShare/tradeShareModel';
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


function resolveMetadataRows(
  data: Partial<TradeFormData>,
  config: TradeMetadataSectionProps['config']
) {
  const shown = (visible: boolean | undefined, values: string[] | undefined) =>
    visible !== false && values ? values : [];
  return {
    accounts: shown(config?.showAccounts, data.account),
    setups: shown(config?.showSetups, data.setup),
    mistakes: shown(config?.showMistakes, data.mistake),
    tags: shown(config?.showTags, data.tags),
    mtComment: typeof data.mtComment === 'string' ? data.mtComment.trim() : '',
  };
}

const ColoredMetadataChip: React.FC<{
  className: string;
  color: ReturnType<typeof getTagLabelColor>;
  children: React.ReactNode;
}> = ({ className, color, children }) => (
  <span
    className={`${className} ${getLabelColorClassName(color)}`}
    style={cssVars({
      '--journalit-label-color': color,
      '--journalit-label-foreground': getLabelColorForeground(color),
    })}
  >
    {children}
  </span>
);

const AccountMetadataRow: React.FC<{
  accounts: string[];
  onAccountClick: TradeMetadataSectionProps['onAccountClick'];
}> = ({ accounts, onAccountClick }) => {
  if (accounts.length === 0) return null;
  return (
    <MetadataRow icon={<User size={18} />} label={t('trade.metadata.account')}>
      {accounts.map((account) => (
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
  );
};

const SetupMetadataRow: React.FC<{
  setups: string[];
  labelColors: TradeLabelColors;
}> = ({ setups, labelColors }) => {
  if (setups.length === 0) return null;
  return (
    <MetadataRow
      icon={<FlaskConical size={18} />}
      label={t('trade.metadata.setups')}
      variant="setup"
    >
      {setups.map((setup) => (
        <ColoredMetadataChip
          key={setup}
          className="tag setup-tag trade-context-chip trade-context-chip--setup"
          color={getSetupLabelColor(labelColors.setups, setup)}
        >
          {setup}
        </ColoredMetadataChip>
      ))}
    </MetadataRow>
  );
};

const MistakeMetadataRow: React.FC<{ mistakes: string[] }> = ({ mistakes }) => {
  if (mistakes.length === 0) return null;
  return (
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
  );
};

const TagMetadataRow: React.FC<{
  tags: string[];
  labelColors: TradeLabelColors;
}> = ({ tags, labelColors }) => {
  if (tags.length === 0) return null;
  return (
    <MetadataRow
      icon={<Tag size={18} />}
      label={t('tradelog.column.tags')}
      variant="tag"
    >
      {tags.map((tag) => (
        <ColoredMetadataChip
          key={tag}
          className="tag trade-context-chip trade-context-chip--tag"
          color={getTagLabelColor(labelColors.tags, tag)}
        >
          {tag}
        </ColoredMetadataChip>
      ))}
    </MetadataRow>
  );
};

const BrokerCommentSection: React.FC<{ comment: string }> = ({ comment }) => {
  if (comment.length === 0) return null;
  return (
    <div
      className="trade-broker-metadata-section"
      {...tradeShareSectionProps('metadata')}
    >
      <div className="details-card trade-broker-metadata-card">
        <div className="details-header">
          <h4>{t('trade.metadata.broker-comment')}</h4>
        </div>
        <div className="trade-broker-metadata-value">{comment}</div>
      </div>
    </div>
  );
};

export const TradeMetadataSection: React.FC<TradeMetadataSectionProps> = ({
  data,
  onAccountClick,
  config,
  labelColors: providedLabelColors,
  children,
}) => {
  const contextLabelColors = useTradeLabelColors();
  const labelColors = providedLabelColors ?? contextLabelColors;
  const rows = resolveMetadataRows(data, config);
  const hasContextRows =
    rows.accounts.length > 0 ||
    rows.setups.length > 0 ||
    rows.mistakes.length > 0 ||
    rows.tags.length > 0;

  
  if (!hasContextRows && rows.mtComment.length === 0 && !children) {
    return null;
  }

  return (
    <>
      {(hasContextRows || children) && (
        <div
          className="trade-context-section"
          {...tradeShareSectionProps('metadata')}
        >
          <div className="trade-context-card">
            <AccountMetadataRow
              accounts={rows.accounts}
              onAccountClick={onAccountClick}
            />
            <SetupMetadataRow setups={rows.setups} labelColors={labelColors} />
            <MistakeMetadataRow mistakes={rows.mistakes} />
            <TagMetadataRow tags={rows.tags} labelColors={labelColors} />
            {children}
          </div>
        </div>
      )}

      <BrokerCommentSection comment={rows.mtComment} />
    </>
  );
};

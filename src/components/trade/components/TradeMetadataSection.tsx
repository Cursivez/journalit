

import React from 'react';
import { TradeFormData } from '../../forms/trade/types';
import { TradeTemplate } from '../../../types/reviewV2';
import { t } from '../../../lang/helpers';

interface TradeMetadataSectionProps {
  data: Partial<TradeFormData>;
  onAccountClick: (accountIdOrName: string) => void;
  config?: TradeTemplate['sections']['metadata'];
}

export const TradeMetadataSection: React.FC<TradeMetadataSectionProps> = ({
  data,
  onAccountClick,
  config,
}) => {
  const hasAccounts = data.account && data.account.length > 0;
  const hasCustomTags = data.customTags && data.customTags.length > 0;
  const hasSetups =
    (data.setup && data.setup.length > 0) ||
    (data.setupIds && data.setupIds.length > 0);
  const mistakes = data.mistake || [];
  const hasMistakes = mistakes.length > 0;
  const mtComment =
    typeof data.mtComment === 'string' ? data.mtComment.trim() : '';
  const hasMTComment = mtComment.length > 0;

  
  const showAccounts = config?.showAccounts !== false;
  const showTags = config?.showTags !== false;
  const showSetups = config?.showSetups !== false;
  const showMistakes = config?.showMistakes !== false;

  
  if (
    (!hasAccounts || !showAccounts) &&
    (!hasCustomTags || !showTags) &&
    !hasMTComment &&
    (!hasSetups || !showSetups) &&
    (!hasMistakes || !showMistakes)
  ) {
    return null;
  }

  return (
    <>
      
      {(showAccounts && hasAccounts) || (showTags && hasCustomTags) ? (
        <div className="trade-metadata-container">
          
          {showAccounts && hasAccounts && (
            <div className="metadata-section">
              <div className="metadata-label">
                {t('trade.metadata.account')}
              </div>
              <div className="metadata-tags">
                {(data.account || []).map((account) => (
                  <button
                    key={account}
                    type="button"
                    className="account-tag"
                    onClick={() => onAccountClick(account)}
                  >
                    {account}
                  </button>
                ))}
              </div>
            </div>
          )}

          
          {showTags && hasCustomTags && (
            <div className="metadata-section">
              <div className="metadata-label">
                {t('trade.metadata.custom-tags')}
              </div>
              <div className="metadata-tags">
                {data.customTags!.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

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

      
      {(showSetups && hasSetups) || (showMistakes && hasMistakes) ? (
        <div className="trade-tags-container">
          <div className="tags-row">
            {showSetups && hasSetups && (
              <div className="tags-section setup-section">
                <h4>{t('trade.metadata.setups')}</h4>
                <div className="tags-list">
                  {(data.setup || data.setupIds || []).map((setup) => (
                    <span key={setup} className="tag setup-tag">
                      {setup}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {showMistakes && hasMistakes && (
              <div className="tags-section mistake-section">
                <h4>{t('trade.metadata.mistakes')}</h4>
                <div className="tags-list">
                  {mistakes.map((mistake) => (
                    <span key={mistake} className="tag mistake-tag">
                      {mistake}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

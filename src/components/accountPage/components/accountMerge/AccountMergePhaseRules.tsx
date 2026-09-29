

import React, { useRef, useState } from 'react';
import { t } from '../../../../lang/helpers';
import type {
  PropChallengeRule,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import { CatalogPicker } from './AccountMergeIdentitySection';
import { createPropChallengeRule } from '../../../../services/propChallenge/PropChallengeConfig';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { ChevronRight, Plus } from '../../../shared/icons/ObsidianIcon';
import { RuleEditor } from '../propChallenge/RuleEditor';
import { RULE_KINDS, parseRuleKind } from '../propChallenge/editorOptions';
import {
  PropFirmPrefillPhaseLink,
  usePropFirmIndex,
} from '../propChallenge/PropFirmPrefillTeaser';

interface Props {
  rules: readonly PropChallengeRule[];
  currencyCode: string;
  startingBalance: number;
  
  showPrefillTeaser: boolean;
  
  offerCatalog: boolean;
  typedFirmName: string;
  onChange: (rules: PropChallengeRule[]) => void;
  onApplyProfile: (selection: PropFirmProfileSelection) => Promise<boolean>;
}

export const AccountMergePhaseRules: React.FC<Props> = ({
  rules,
  currencyCode,
  startingBalance,
  showPrefillTeaser,
  offerCatalog,
  typedFirmName,
  onChange,
  onApplyProfile,
}) => {
  const [expandedRuleId, setExpandedRuleId] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const addRuleTriggerRef = useRef<HTMLButtonElement>(null);
  const firms = usePropFirmIndex();

  return (
    <div className="journalit-account-merge-modal__phase-rules journalit-prop-challenge-rules">
      <div className="journalit-prop-challenge-rules-heading">
        <strong>{t('account.prop-challenge.rules')}</strong>
        <DropdownSelect
          value=""
          options={RULE_KINDS.map((kind) => ({
            value: kind,
            label: t(`account.prop-challenge.rule.${kind}`),
          }))}
          onChange={(kind) => {
            const rule = createPropChallengeRule(parseRuleKind(kind));
            setExpandedRuleId(rule.id);
            onChange([...rules, rule]);
          }}
          ariaLabel={t('account.prop-challenge.add-rule')}
          placeholder={t('account.prop-challenge.add-rule')}
          className="journalit-prop-challenge-add-rule-menu"
          leadingContent={<Plus size={15} aria-hidden="true" />}
          triggerRef={addRuleTriggerRef}
        />
      </div>
      {rules.length === 0 && (
        <div className="journalit-prop-challenge-rules-empty">
          {t('account.prop-challenge.rules.empty')}
          {showPrefillTeaser && (
            <PropFirmPrefillPhaseLink
              firms={firms}
              typedFirmName={typedFirmName}
            />
          )}
          {offerCatalog && !pickerOpen && (
            <button
              type="button"
              className="journalit-native-button journalit-prop-prefill-match"
              onClick={() => setPickerOpen(true)}
            >
              <span>{t('account.merge.phase.apply-profile')}</span>
              <ChevronRight
                size={12}
                aria-hidden="true"
                className="journalit-prop-prefill-chevron"
              />
            </button>
          )}
        </div>
      )}
      {offerCatalog && pickerOpen && (
        <CatalogPicker
          currency={currencyCode}
          initialFirmName={typedFirmName}
          onApply={onApplyProfile}
        />
      )}
      {rules.map((rule, index) => (
        <RuleEditor
          key={rule.id}
          rule={rule}
          ordinal={index + 1}
          currencyCode={currencyCode}
          startingBalance={startingBalance}
          expanded={expandedRuleId === rule.id}
          disabled={false}
          toggleRef={() => undefined}
          onToggle={() =>
            setExpandedRuleId((current) => (current === rule.id ? '' : rule.id))
          }
          onChange={(next) =>
            onChange(
              rules.map((entry) => (entry.id === next.id ? next : entry))
            )
          }
          onRemove={() => {
            if (expandedRuleId === rule.id) setExpandedRuleId('');
            onChange(rules.filter((entry) => entry.id !== rule.id));
            window.requestAnimationFrame(() =>
              addRuleTriggerRef.current?.focus()
            );
          }}
        />
      ))}
    </div>
  );
};

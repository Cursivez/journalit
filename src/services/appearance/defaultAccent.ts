

import type JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';

const DEFAULT_ACCENT_BODY_CLASS = 'journalit-default-accent';


export const DEFAULT_ACCENT_OVERRIDDEN_PROPERTIES = [
  '--accent-h',
  '--accent-s',
  '--accent-l',
  '--color-accent',
  '--color-accent-1',
  '--color-accent-2',
  '--color-accent-hsl',
  '--text-accent',
  '--text-accent-hover',
  '--text-on-accent',
  '--interactive-accent',
  '--interactive-accent-hover',
  '--interactive-accent-hsl',
  '--text-selection',
  '--checkbox-color',
  '--checkbox-color-hover',
  '--link-color',
  '--link-color-hover',
  '--link-external-color',
  '--link-external-color-hover',
  '--link-unresolved-color',
  '--link-unresolved-decoration-color',
  '--tag-color',
  '--tag-color-hover',
  '--tag-background',
  '--tag-background-hover',
  '--tag-border-color',
  '--tag-border-color-hover',
  '--slider-fill-background',
  '--icon-color-active',
  '--nav-item-color-highlighted',
  '--nav-item-background-selected',
  '--background-modifier-active-hover',
  '--blockquote-border-color',
  '--collapse-icon-color-collapsed',
  '--list-marker-color-collapsed',
  '--divider-color-hover',
  '--embed-border-start',
  '--table-selection',
  '--table-selection-border-color',
  '--pill-color-remove-hover',
] as const;

function isObsidianAppStylesheet(sheet: CSSStyleSheet): boolean {
  return sheet.href?.endsWith('/app.css') ?? false;
}

const OVERRIDDEN_PROPERTY_SET: ReadonlySet<string> = new Set(
  DEFAULT_ACCENT_OVERRIDDEN_PROPERTIES
);



function declaresAccent(style: CSSStyleDeclaration): boolean {
  for (let index = 0; index < style.length; index++) {
    if (OVERRIDDEN_PROPERTY_SET.has(style[index])) return true;
  }
  return false;
}

function appliesToRoot(selector: string, doc: Document): boolean {
  try {
    return doc.body.matches(selector) || doc.documentElement.matches(selector);
  } catch {
    
    
    return false;
  }
}

function rulesDeclareRootAccent(rules: CSSRuleList, doc: Document): boolean {
  for (const rule of Array.from(rules)) {
    if (
      rule instanceof CSSStyleRule &&
      declaresAccent(rule.style) &&
      appliesToRoot(rule.selectorText, doc)
    ) {
      return true;
    }
    
    
    
    if (
      'cssRules' in rule &&
      rule.cssRules instanceof CSSRuleList &&
      rulesDeclareRootAccent(rule.cssRules, doc)
    ) {
      return true;
    }
  }
  return false;
}


export function hasInlineAccent(doc: Document): boolean {
  return doc.body.style.getPropertyValue('--accent-h') !== '';
}


export function stylesheetsDeclareAccent(doc: Document): boolean {
  for (const sheet of Array.from(doc.styleSheets)) {
    if (isObsidianAppStylesheet(sheet)) continue;
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      
      
      continue;
    }
    if (rulesDeclareRootAccent(rules, doc)) return true;
  }
  return false;
}


export function startDefaultAccentBodyClass(host: JournalitPlugin): void {
  const { workspace } = host.app;
  const mainDoc = workspace.rootSplit.doc;
  const mainWin = mainDoc.win;
  const bodies = new Set<HTMLElement>([mainDoc.body]);
  
  workspace.iterateAllLeaves((leaf) => {
    bodies.add(leaf.getContainer().doc.body);
  });

  let stylesheetAccent = stylesheetsDeclareAccent(mainDoc);
  let rescanPending = false;
  let scheduledTimer: number | null = null;

  const apply = (body: HTMLElement): void => {
    const usesDefaultAccent =
      host.settings.general?.accentColorSource !== 'obsidian' &&
      !stylesheetAccent &&
      !hasInlineAccent(mainDoc);
    body.toggleClass(DEFAULT_ACCENT_BODY_CLASS, usesDefaultAccent);
  };

  const evaluate = (): void => {
    scheduledTimer = null;
    if (rescanPending) {
      rescanPending = false;
      stylesheetAccent = stylesheetsDeclareAccent(mainDoc);
    }
    bodies.forEach(apply);
  };

  
  
  const scheduleEvaluate = (rescanStylesheets: boolean): void => {
    rescanPending ||= rescanStylesheets;
    if (scheduledTimer !== null) return;
    scheduledTimer = mainWin.setTimeout(evaluate, 0);
  };

  evaluate();

  
  
  const inlineObserver = new MutationObserver(() => scheduleEvaluate(false));
  inlineObserver.observe(mainDoc.body, {
    attributes: true,
    attributeFilter: ['style'],
  });
  const stylesheetObserver = new MutationObserver(() => scheduleEvaluate(true));
  stylesheetObserver.observe(mainDoc.head, { childList: true });

  host.registerEvent(workspace.on('css-change', () => scheduleEvaluate(true)));
  
  
  host.register(
    eventBus.subscribe('appearance:accent-source-changed', () =>
      scheduleEvaluate(false)
    )
  );
  host.register(
    eventBus.subscribe('settings:changed', (payload) => {
      if (payload.section === 'all') scheduleEvaluate(false);
    })
  );
  host.registerEvent(
    workspace.on('window-open', (workspaceWindow) => {
      bodies.add(workspaceWindow.doc.body);
      apply(workspaceWindow.doc.body);
    })
  );
  host.registerEvent(
    workspace.on('window-close', (workspaceWindow) => {
      bodies.delete(workspaceWindow.doc.body);
    })
  );

  host.register(() => {
    inlineObserver.disconnect();
    stylesheetObserver.disconnect();
    if (scheduledTimer !== null) mainWin.clearTimeout(scheduledTimer);
    bodies.forEach((body) => body.removeClass(DEFAULT_ACCENT_BODY_CLASS));
    bodies.clear();
  });
}

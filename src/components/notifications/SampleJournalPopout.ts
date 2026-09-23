import type {
  DemoSessionService,
  DemoSessionSnapshot,
} from '../../demo/DemoSessionService';
import { t } from '../../lang/helpers';
import {
  mountBottomLeftNotification,
  removeBottomLeftNotification,
} from './BottomLeftNotificationHost';

interface PopoutAction {
  label: string;
  variant: 'primary' | 'secondary';
  run: () => Promise<void>;
}

export class SampleJournalPopout {
  private containerEl: HTMLElement | null = null;
  private unsubscribeSession: (() => void) | null = null;
  private hideTimeoutId: number | null = null;

  constructor(private readonly session: DemoSessionService) {}

  start(): void {
    if (this.unsubscribeSession) return;
    this.unsubscribeSession = this.session.subscribe(() => this.render());
    this.render();
  }

  cleanup(): void {
    this.unsubscribeSession?.();
    this.unsubscribeSession = null;
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    if (this.containerEl) {
      removeBottomLeftNotification(this.containerEl);
    }
    this.containerEl = null;
  }

  private render(): void {
    const snapshot = this.session.getSnapshot();
    const hasClosedSession =
      !snapshot.active && this.session.hasRecoverableSession();
    if (!snapshot.active && !hasClosedSession) {
      this.hide();
      return;
    }

    const container = this.ensureContainer();
    container.replaceChildren();

    container.createEl('h3', {
      cls: 'journalit-sample-popout__title',
      text: t('sample.popout.title'),
    });
    container.createDiv({
      cls: 'journalit-sample-popout__description',
      text: this.getDescription(snapshot, hasClosedSession),
    });

    const actions = container.createDiv({
      cls: 'journalit-sample-popout__actions',
    });
    const firstAction: PopoutAction = hasClosedSession
      ? {
          label: t('button.open'),
          variant: 'primary',
          run: () => this.session.startOrOpen(),
        }
      : {
          label: t('sample.popout.action.exit'),
          variant: 'primary',
          run: () => this.session.requestExit(),
        };
    const popoutActions: PopoutAction[] = [
      firstAction,
      {
        label: t('button.reset'),
        variant: 'secondary',
        run: () => this.session.requestReset(),
      },
    ];
    popoutActions.forEach((action) => {
      this.createAction(actions, action, snapshot.busy);
    });

    window.requestAnimationFrame(() => {
      if (this.containerEl === container && container.isConnected) {
        container.classList.add('journalit-sample-popout--visible');
      }
    });
  }

  private ensureContainer(): HTMLElement {
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    if (!this.containerEl) {
      this.containerEl = mountBottomLeftNotification('journalit-sample-popout');
    }
    return this.containerEl;
  }

  private getDescription(
    snapshot: DemoSessionSnapshot,
    hasClosedSession: boolean
  ): string {
    if (snapshot.phase === 'failed') return t('sample.popout.recovery');
    if (hasClosedSession) return t('sample.popout.closed');
    return t('sample.popout.description');
  }

  private createAction(
    container: HTMLElement,
    action: PopoutAction,
    disabled: boolean
  ): void {
    const variantClass =
      action.variant === 'primary'
        ? 'journalit-sample-popout__button--primary'
        : 'journalit-sample-popout__button--secondary';
    const button = container.createEl('button', {
      cls: `${variantClass} journalit-sample-popout__button`,
      attr: { type: 'button' },
      text: action.label,
    });
    button.disabled = disabled;
    button.addEventListener('click', () => void action.run());
  }

  private hide(): void {
    if (!this.containerEl) return;
    const container = this.containerEl;
    container.classList.remove('journalit-sample-popout--visible');
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
    }
    this.hideTimeoutId = window.setTimeout(() => {
      if (this.containerEl === container) {
        removeBottomLeftNotification(container);
        this.containerEl = null;
      }
      this.hideTimeoutId = null;
    }, 300);
  }
}

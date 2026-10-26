import React from 'react';
import { t } from '../../lang/helpers';

interface SectionErrorBoundaryProps {
  
  name: string;
  children: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}


export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Journalit: ${this.props.name} crashed`, {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <SectionErrorFallback
        onRetry={() => this.setState({ hasError: false })}
      />
    );
  }
}


export function SectionErrorFallback({
  onRetry,
}: {
  onRetry: () => void;
}): React.ReactElement {
  return (
    <div className="journalit-section-error" role="alert">
      <span>{t('common.section-error')}</span>
      <button
        type="button"
        className="journalit-section-error__retry"
        onClick={onRetry}
      >
        {t('common.retry')}
      </button>
    </div>
  );
}

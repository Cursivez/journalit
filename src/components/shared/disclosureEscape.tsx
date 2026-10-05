import React, {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
} from 'react';
import { Scope, type App } from 'obsidian';

type EscapeRegistrar = (onEscape: () => void) => () => void;
const EscapeInterceptorContext = createContext<EscapeRegistrar | null>(null);


export function ModalEscapeProvider({
  app,
  scope,
  children,
}: {
  app: Pick<App, 'keymap'>;
  scope: Scope;
  children: React.ReactNode;
}) {
  const register = useMemo<EscapeRegistrar>(
    () => (onEscape) => {
      const helpScope = new Scope(scope);
      helpScope.register([], 'Escape', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
        return false;
      });
      app.keymap.pushScope(helpScope);
      return () => app.keymap.popScope(helpScope);
    },
    [app, scope]
  );
  return (
    <EscapeInterceptorContext.Provider value={register}>
      {children}
    </EscapeInterceptorContext.Provider>
  );
}

export function useDisclosureEscape({
  active,
  onEscape,
}: {
  active: boolean;
  onEscape: () => void;
}) {
  const register = useContext(EscapeInterceptorContext);
  const dismiss = useEffectEvent(onEscape);
  useEffect(() => {
    if (!active || !register) return;
    
    
    return register(() => dismiss());
  }, [active, register]);
}

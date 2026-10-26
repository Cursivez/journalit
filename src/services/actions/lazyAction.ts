import type { ActionDefinition, ActionId } from './ActionTypes';


export function lazyAction<Id extends ActionId>(
  load: () => Promise<ActionDefinition<Id>>
): ActionDefinition<Id> {
  let loading: Promise<ActionDefinition<Id>> | null = null;
  return {
    async plan(input, context) {
      if (context.signal.aborted) throw context.signal.reason;
      loading ??= load().catch((error: unknown) => {
        loading = null;
        throw error;
      });
      const definition = await loading;
      return definition.plan(input, context);
    },
  };
}

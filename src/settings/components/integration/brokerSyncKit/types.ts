


export interface LocalAccountOption {
  id: string;
  name: string;
}


export type BrokerStatusState<TData> =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'loaded'; data: TData }
  | { kind: 'failed' };


export interface BrokerDataOwnership {
  ownerUserId: string;
  isCurrent: () => boolean;
}

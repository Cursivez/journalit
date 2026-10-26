import type { ActionInput, ActionSummary } from '../../actions/ActionTypes';

type CreateAction =
  | 'tag.create'
  | 'mistake.create'
  | 'account_type.create'
  | 'event.create';
type CreateValue<Id extends CreateAction> = ActionInput<Id>['values'][number];


export type OptionCatalogChange =
  | ({ kind: 'create_tag' } & CreateValue<'tag.create'>)
  | ({ kind: 'create_mistake' } & CreateValue<'mistake.create'>)
  | ({ kind: 'create_account_type' } & CreateValue<'account_type.create'>)
  | ({ kind: 'create_event' } & CreateValue<'event.create'>)
  | ({ kind: 'set_tag_color' } & ActionInput<'tag.set_color'>)
  | ({ kind: 'clear_tag_color' } & ActionInput<'tag.clear_color'>)
  | ({ kind: 'update_event_style' } & ActionInput<'event.update_style'>)
  | ({ kind: 'rename_tag' } & ActionInput<'tag.rename'>)
  | ({ kind: 'merge_tags' } & ActionInput<'tag.merge'>)
  | ({ kind: 'delete_tag' } & ActionInput<'tag.delete'>)
  | ({ kind: 'rename_mistake' } & ActionInput<'mistake.rename'>)
  | ({ kind: 'merge_mistakes' } & ActionInput<'mistake.merge'>)
  | ({ kind: 'delete_mistake' } & ActionInput<'mistake.delete'>)
  | ({ kind: 'rename_account_type' } & ActionInput<'account_type.rename'>)
  | ({ kind: 'move_account_type' } & ActionInput<'account_type.move'>)
  | ({ kind: 'delete_account_type' } & ActionInput<'account_type.delete'>)
  | ({ kind: 'rename_event' } & ActionInput<'event.rename'>)
  | ({ kind: 'merge_events' } & ActionInput<'event.merge'>)
  | ({ kind: 'delete_event' } & ActionInput<'event.delete'>);

type CreatedChange<Id extends CreateAction> =
  ActionSummary<Id>['created'][number]['change'];


export type OptionChangeSummary =
  | CreatedChange<'tag.create'>
  | CreatedChange<'mistake.create'>
  | CreatedChange<'account_type.create'>
  | CreatedChange<'event.create'>
  | ActionSummary<'tag.set_color'>['change']
  | ActionSummary<'tag.clear_color'>['change']
  | ActionSummary<'event.update_style'>['change']
  | ActionSummary<'tag.rename'>['change']
  | ActionSummary<'tag.merge'>['change']
  | ActionSummary<'tag.delete'>['change']
  | ActionSummary<'mistake.rename'>['change']
  | ActionSummary<'mistake.merge'>['change']
  | ActionSummary<'mistake.delete'>['change']
  | ActionSummary<'account_type.rename'>['change']
  | ActionSummary<'account_type.move'>['change']
  | ActionSummary<'account_type.delete'>['change']
  | ActionSummary<'event.rename'>['change']
  | ActionSummary<'event.merge'>['change']
  | ActionSummary<'event.delete'>['change'];

export type OptionAffectedEntry = ActionSummary<'tag.rename'>['affected_entry'];

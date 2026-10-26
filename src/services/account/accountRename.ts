import { OptionType, type CustomOptionsService } from '../options';


export async function rewriteAccountReferenceNotes(
  optionsService: Pick<
    CustomOptionsService,
    'updateOption' | 'updateNotesForOptionValue'
  >,
  oldName: string,
  newName: string
): Promise<void> {
  const result = await optionsService.updateOption(
    OptionType.ACCOUNT,
    oldName,
    newName,
    true
  );
  if (!result.success) {
    await optionsService.updateNotesForOptionValue(
      OptionType.ACCOUNT,
      oldName,
      newName
    );
  }
}

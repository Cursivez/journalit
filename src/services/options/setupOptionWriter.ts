export type SetupOptionMutationResult =
  | { success: false }
  | { success: true; updatedNotes: number; rollback(): Promise<void> };


export interface SetupOptionWriter {
  rename(
    oldName: string,
    newName: string,
    updateNotes: boolean
  ): Promise<SetupOptionMutationResult>;
  
  remove(
    name: string,
    options?: { expectNone?: boolean }
  ): Promise<SetupOptionMutationResult>;
}


export async function withSetupOptionWriter<T>(
  delegate: SetupOptionWriter,
  operation: (writer: SetupOptionWriter) => Promise<T>
): Promise<T> {
  let active = true;
  let tail = Promise.resolve();
  const failures: unknown[] = [];
  function write<TResult>(perform: () => Promise<TResult>): Promise<TResult> {
    if (!active)
      return Promise.reject(new Error('Setup option writer has expired'));
    
    const result = tail.then(perform);
    tail = result.then(
      () => undefined,
      (error: unknown) => {
        failures.push(error);
      }
    );
    return result;
  }
  function writeMutation(
    perform: () => Promise<SetupOptionMutationResult>
  ): Promise<SetupOptionMutationResult> {
    return write(async () => {
      const changed = await perform();
      if (!changed.success) return changed;
      return {
        success: true,
        updatedNotes: changed.updatedNotes,
        rollback: () => write(() => changed.rollback()),
      } satisfies SetupOptionMutationResult;
    });
  }
  const result = Promise.resolve().then(() =>
    operation({
      rename: (oldName, newName, updateNotes) =>
        writeMutation(() => delegate.rename(oldName, newName, updateNotes)),
      remove: (name, options) =>
        writeMutation(() => delegate.remove(name, options)),
    })
  );
  const outcome = await result.then(
    (value) =>
      ({ status: 'fulfilled', value }) satisfies PromiseFulfilledResult<T>,
    (reason: unknown) =>
      ({ status: 'rejected', reason }) satisfies PromiseRejectedResult
  );
  active = false;
  await tail;
  const distinctFailures = [...new Set(failures)];
  if (outcome.status === 'rejected') {
    const covered = new Set<unknown>();
    const pending: unknown[] = [outcome.reason];
    while (pending.length > 0) {
      const failure = pending.pop();
      if (covered.has(failure)) continue;
      covered.add(failure);
      if (failure instanceof AggregateError) {
        const nested: unknown[] = failure.errors;
        pending.push(...nested);
      }
    }
    const extra = distinctFailures.filter((failure) => !covered.has(failure));
    if (extra.length === 0) throw outcome.reason;
    throw new AggregateError(
      [outcome.reason, ...extra],
      outcome.reason instanceof Error
        ? outcome.reason.message
        : 'Setup option writes failed'
    );
  }
  if (distinctFailures.length === 1) throw distinctFailures[0];
  if (distinctFailures.length > 1)
    throw new AggregateError(distinctFailures, 'Setup option writes failed');
  return outcome.value;
}

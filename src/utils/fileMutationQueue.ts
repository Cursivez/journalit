const mutationQueues = new Map<string, Promise<void>>();


export async function enqueueFileMutation(
  namespace: string,
  filePath: string,
  task: () => Promise<void>
): Promise<void> {
  const key = `${namespace}:${filePath}`;
  const previousTask = mutationQueues.get(key) ?? Promise.resolve();
  const nextTask = previousTask.catch(() => undefined).then(task);
  mutationQueues.set(key, nextTask);
  try {
    await nextTask;
  } finally {
    if (mutationQueues.get(key) === nextTask) {
      mutationQueues.delete(key);
    }
  }
}

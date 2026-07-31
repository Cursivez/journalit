export function moveItemByDirection<T>(
  items: readonly T[],
  currentIndex: number,
  direction: 'up' | 'down'
): T[] | null {
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (
    currentIndex < 0 ||
    currentIndex >= items.length ||
    targetIndex < 0 ||
    targetIndex >= items.length
  ) {
    return null;
  }

  const reorderedItems = [...items];
  const [movedItem] = reorderedItems.splice(currentIndex, 1);
  reorderedItems.splice(targetIndex, 0, movedItem);
  return reorderedItems;
}

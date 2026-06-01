export function mixFeedWithAds<T extends { id: string }>(
  items: T[],
  adEvery = 8,
  adFactory: (index: number) => T
): T[] {
  const result: T[] = [];
  items.forEach((item, i) => {
    result.push(item);
    if ((i + 1) % adEvery === 0) {
      result.push(adFactory(i));
    }
  });
  return result;
}

export const range = (
  startOrEnd: number,
  end: number | null | undefined = null,
  step = 1
): number[] => {
  const isEndNullish = isNullish(end);

  return Array.from(
    {
      length: Math.ceil(
        Math.abs(isEndNullish ? startOrEnd : end - startOrEnd) / step
      ),
    },
    (_, i) => i * step + (isEndNullish ? 0 : startOrEnd)
  );
};

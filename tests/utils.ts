export const expectDateString = () =>
  expect.stringMatching(
    /^(?:[A-Z][a-z]{2} ){2}\d{2} \d{4} (?:\d{2}:){2}\d{2} [A-Z]+\+\d{4} \(([A-Z][a-z]+ )*[A-Z][a-z]+\)$/
  );

export const expectUuid = () => expect.stringMatching(/^[\da-z-]{36}$/);

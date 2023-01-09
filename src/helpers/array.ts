export const sortByTitle = <T extends { title: string }>(arr: T[]): T[] =>
  [...arr].sort((a, b) => (a.title > b.title ? 1 : -1));

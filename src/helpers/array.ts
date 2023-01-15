import { Day } from '~/types/basic';

export const sortByTitle = <T extends { title: string }>(arr: T[]): T[] =>
  [...arr].sort((a, b) =>
    a.title.toLowerCase() > b.title.toLocaleLowerCase() ? 1 : -1
  );

const DAYS_ORDERED = [
  Day.Monday,
  Day.Tuesday,
  Day.Wednesday,
  Day.Thursday,
  Day.Friday,
  Day.Saturday,
  Day.Sunday,
];

export const mapDays = <T>(cb: (day: Day) => T) => DAYS_ORDERED.map(cb);

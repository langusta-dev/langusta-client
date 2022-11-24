export const capitalize = (str: string) =>
  str.length ? str[0].toUpperCase() + str.slice(1) : str;

export const isEmail = (str: string) =>
  /^[.01A-Z_a-z-]+@[01A-Z_a-z-]+\.[01A-Z_a-z-]+$/.test(str);

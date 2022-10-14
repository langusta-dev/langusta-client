export const isEmail = (str: string) =>
  /^[.01A-Z_a-z-]+@[01A-Z_a-z-]+\.[01A-Z_a-z-]+$/.test(str)

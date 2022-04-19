export const trimString = (s: string) =>
  s.replace(/([\n\t]{1,}|\s{2,})/g, ' ').trim();

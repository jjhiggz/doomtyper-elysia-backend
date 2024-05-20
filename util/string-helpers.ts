export const underscore = (str: string): string => {
  return str
    .replace(/::/, "/")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .replace(/-/g, "_")
    .toLowerCase();
};

export const kebab = (str: string): string => {
  return str
    .replace(/::/, "/")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .replace(/_/g, "-")
    .toLowerCase();
};

export const StringHelpers = {
  kebab,
  underscore,
};

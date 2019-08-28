export const toCamelCase = string => string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
  return word.toUpperCase();
}).replace(/\s+/g, '').replace(/-+/g, '');

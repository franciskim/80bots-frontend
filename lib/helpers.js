export const toCamelCase = string => string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
  return word.toUpperCase();
}).replace(/\s+/g, '').replace(/-+/g, '');

export const arrayToCsv = (arr) => {
  const data = typeof arr !== 'object' ? JSON.parse(arr) : arr;
  const fields = Object.keys(arr[0]);
  let str = fields.join(',') + '\r\n';
  for (let i = 0; i < data.length; i++) {
    let output = [];

    for(let j = 0; j < fields.length; j++) {
      output.push(`"${data[i][fields[j]]}"`);
    }
    str += output.join(',') + '\r\n';
  }

  return str;
};

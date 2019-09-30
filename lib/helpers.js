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

/**
 *
 * @param {Object|ArrayBuffer|Array|File|FormData} data Data to download
 * @param {String} fileName Downloaded file name
 * @param {String} mimeType Mime type of downloaded file
 *
 */
export const download = (data, fileName, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });
  let a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
  }, 0);
};

/**
 *
 * @param {ArrayBuffer} buf Data to convert
 *
 */
export const abtos = (buf) => {
  return (new Uint8Array(buf)).reduce((all, current) => all + String.fromCharCode(current), '');
};

import {lookup as getMime} from "mime-types";
import moment from "moment-timezone";
import dayjs from "dayjs";

export const toCamelCase = string => string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
  return word.toUpperCase();
}).replace(/\s+/g, '').replace(/-+/g, '');

// TODO: improve it to display nested normally
export const arrayToCsv = (arr, combineFields = false) => {
  const data = typeof arr !== 'object' ? JSON.parse(arr) : arr;
  const fields = Object.keys(arr[0]);
  let str = combineFields ? '' : fields.join(',') + '\r\n';
  if(combineFields) {
    return fields
      .map(field => data.map(item => item[field]))
      .reduce((all, current) => all + `${current.join('\n')}` + '\r\n', '');
  }
  for (let i = 0; i < data.length; i++) {
    let output = [];
    for(let j = 0; j < fields.length; j++) {
      let result = data[i][fields[j]];
      if(result && typeof result === 'object' && result.length) {
        result = arrayToCsv(result, true);
      }
      output.push(`"${result}"`);
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

export const parseUrl = (url, expectedType, resolve, reject) => {
  const Http = new XMLHttpRequest();
  Http.open('GET', url);
  Http.setRequestHeader('Cache-Control', 'no-cache');
  Http.send();
  Http.onload = (e) => {
    const blobObj = new Blob([Http.responseText], {
      type: expectedType
    });
    return blobObj.arrayBuffer()
      .then(resolve)
      .catch(reject);
  };
};

export const getContent = (url, expectedType) => new Promise((resolve, reject) => {
  const Http = new XMLHttpRequest();
  Http.open('GET', url);
  Http.setRequestHeader('Cache-Control', 'no-cache');
  Http.send();
  Http.onload = (e) => {
    const blobObj = new Blob([Http.responseText], {
      type: expectedType
    });
    return blobObj.arrayBuffer()
      .then(resolve)
      .catch(reject);
  };
});

/**
 *
 * @param {ArrayBuffer} buf Data to convert
 *
 */
export const abtos = (buf) => {
  return (new Uint8Array(buf)).reduce((all, current) => all + String.fromCharCode(current), '');
};

export const minToTime = minutes => {
  if(minutes <= 59) {
    return minutes + ' min';
  } else {
    const time = ((Math.round(minutes / 30)) / 2).toFixed(1);
    return Math.round(Number(time)) === 1 ? time + ' hr' : time + ' hrs';
  }
};

/**
 * The function converts the date according to the selected time zone.
 *
 * @param {date} scheduleDate - date to be converted
 * @param {string} currentTimezone - current time zone
 * @param {string} formatTimezone - time zone to which the date should be converted
 * @returns {string}
 */
export const formatTimezone = (scheduleDate, currentTimezone, formatTimezone) => {
    const date = formatDate(scheduleDate);
    const formatCurrentTime = moment.tz(`${date}`, `${currentTimezone}`);
    return formatCurrentTime.tz(formatTimezone).format('YYYY-MM-DD HH:mm');
};

/**
 * The function returns the local time.
 *
 * @param {string} date - date to be converted
 * @returns {Date}
 */
export const formatToDate = (date) => {
    return dayjs(date).toDate();
};

/**
 * The function formats the local time into "YYYY-MM-DD HH:mm" format.
 *
 * @param {date} date - date to be converted
 * @returns {string}
 */
export const formatDate = (date) => {
    return dayjs(date ?? new Date()).format("YYYY-MM-DD HH:mm");
};

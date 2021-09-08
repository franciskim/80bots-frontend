import moment from 'moment-timezone'
import { NOTIFICATION_TYPES } from 'config'
import { toastr } from 'react-redux-toastr'

export const addNotification = (payload) => {
  const { type, message } = payload
  let func
  let title
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      title = 'Successful'
      func = toastr.success
      break
    case NOTIFICATION_TYPES.ERROR:
      title = 'Error'
      func = toastr.error
      break
    case NOTIFICATION_TYPES.HELP:
      title = 'Help'
      func = toastr.warning
      break
    case NOTIFICATION_TYPES.INFO:
      title = 'Information'
      func = toastr.info
      break
  }
  func(title, message)
}

export const toCamelCase = (string) =>
  string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return word.toUpperCase()
    })
    .replace(/\s+/g, '')
    .replace(/-+/g, '')

// TODO: improve it to display nested normally
export const arrayToCsv = (arr, combineFields = false) => {
  const data = typeof arr !== 'object' ? JSON.parse(arr) : arr
  const fields = Object.keys(arr[0])
  let str = combineFields ? '' : fields.join(',') + '\r\n'
  if (combineFields) {
    return fields
      .map((field) => data.map((item) => item[field]))
      .reduce((all, current) => all + `${current.join('\n')}` + '\r\n', '')
  }
  for (let i = 0; i < data.length; i++) {
    let output = []
    for (let j = 0; j < fields.length; j++) {
      let result = data[i][fields[j]]
      if (result && typeof result === 'object' && result.length) {
        result = arrayToCsv(result, true)
      }
      output.push(`"${result}"`)
    }
    str += output.join(',') + '\r\n'
  }

  return str
}

/**
 *
 * @param {Object|ArrayBuffer|Array|File|FormData} data Data to download
 * @param {String} fileName Downloaded file name
 * @param {String} mimeType Mime type of downloaded file
 *
 */
export const download = (data, fileName, mimeType) => {
  const blob = new Blob([data], { type: mimeType })
  const file = new File([blob], fileName, { type: mimeType })
  let a = document.createElement('a')
  a.href = URL.createObjectURL(file)
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  setTimeout(function () {
    document.body.removeChild(a)
  }, 0)
}

/**
 *
 * @param {ArrayBuffer} buf Data to convert
 *
 */
export const abtos = (buf) => {
  return new Uint8Array(buf).reduce(
    (all, current) => all + String.fromCharCode(current),
    ''
  )
}

/**
 * The function return the number of minutes in hours and minutes.
 *
 * @param {string} n - minutes.
 * @returns {string}
 */
export const minToTime = (n) => {
  const hours = n / 60
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)
  return rhours + ' hrs' + ', ' + rminutes + ' mins'
}

export const formatTimezone = (userTimezone, date) => {
  const formatCurrentTime = moment.tz(date, 'UTC')
  return formatCurrentTime.tz(userTimezone).format('YYYY-MM-DD HH:mm:ss')
}

export const formatScreenshot = (item) => {
  let newDate = item
  if (
    newDate.split(' ')[0] === 'black_screenshot' ||
    newDate.split(' ')[0] === 'blank_screenshot'
  ) {
    newDate = newDate.split(' ')[1]
  }
  if (newDate.split('/') > 0) {
    newDate = newDate.split('/')[newDate.split('/').legnth - 1]
  }
  const timeArr = newDate.split('-')
  if (timeArr.length == 6) {
    return (
      timeArr[0] +
      '-' +
      timeArr[1] +
      '-' +
      timeArr[2] +
      ' ' +
      timeArr[3] +
      ':' +
      timeArr[4] +
      ':' +
      timeArr[5]
    )
  }
  return item
}

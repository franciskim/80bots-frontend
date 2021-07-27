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

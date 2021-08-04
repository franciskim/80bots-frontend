import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'lib/helpers'
import { updateStatus } from 'store/user/actions'

const UserTableRow = ({ user }) => {
  const dispatch = useDispatch()

  const handleStatusChange = (user) => {
    dispatch(
      updateStatus(user.id, {
        status: user.status === 'active' ? 'inactive' : 'active',
      })
    ).then(() => {
      const status = user.status === 'active' ? 'deactivated' : 'activated'
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `User was successfully ${status}`,
      })
    })
  }

  return (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
      <td>
        <label className="custom-toggle custom-toggle-success">
          <input
            defaultChecked
            type="checkbox"
            className="success"
            onChange={() => handleStatusChange(user)}
          />
          <span
            className="custom-toggle-slider rounded-circle"
            data-label-off="No"
            data-label-on="Yes"
          />
        </label>
      </td>
    </tr>
  )
}

UserTableRow.propTypes = {
  user: PropTypes.object.isRequired,
}

export default UserTableRow

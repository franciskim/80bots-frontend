import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const ScheduleLogTableRow = ({ session }) => {
  return (
    <tr key={session.id}>
      <td>{session.user}</td>
      <td>{session.instance_id}</td>
      <td>{session.type}</td>
      <td>{dayjs(session.date).format('YYYY-MM-DD hh:mm A')}</td>
      <td>{session.time_zone}</td>
      <td>{session.status}</td>
    </tr>
  )
}

ScheduleLogTableRow.propTypes = {
  session: PropTypes.object.isRequired,
}

export default ScheduleLogTableRow

import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { Badge } from 'reactstrap'

const ScheduleLogTableRow = ({ session }) => {
  return (
    <tr key={session.id}>
      <td>{session.user}</td>
      <td>{session.instance_id}</td>
      <td>{session.type}</td>
      <td>{dayjs(session.date).format('YYYY-MM-DD hh:mm A')}</td>
      <td>
        <Badge>{session.time_zone}</Badge>
      </td>
      <td>
        {session.status === 'failed' && (
          <>
            <Badge color="" className="badge-dot mr-4">
              <i className="bg-warning" />
              <span className="status">{session.status}</span>
            </Badge>
          </>
        )}
        {session.status === 'succeed' && (
          <>
            <Badge color="" className="badge-dot mr-4">
              <i className="bg-success" />
              <span className="status">{session.status}</span>
            </Badge>
          </>
        )}
      </td>
    </tr>
  )
}

ScheduleLogTableRow.propTypes = {
  session: PropTypes.object.isRequired,
}

export default ScheduleLogTableRow

import React from 'react'
import { Badge } from 'reactstrap'
import PropTypes from 'prop-types'

const ScheduleTableRow = ({
  schedule,
  onEdit,
  onDelete,
  handleStatusChange,
}) => {
  return (
    <tr key={schedule.id}>
      <td>{schedule.user}</td>
      <td>{schedule.instance_id}</td>
      <td>{schedule.bot_name}</td>
      <td>
        <label className="custom-toggle custom-toggle-success">
          <input
            defaultChecked
            type="checkbox"
            className="success"
            onChange={() => handleStatusChange(schedule)}
          />
          <span
            className="custom-toggle-slider rounded-circle"
            data-label-off="No"
            data-label-on="Yes"
          />
        </label>
      </td>
      <td>
        {schedule.details.length > 0 ? (
          <ul className="list-unstyled">
            {schedule.details.map((detail, idx) => (
              <li key={idx}>
                <Badge pill color={'info'} key={idx}>
                  {detail.status +
                    ' at ' +
                    detail.day +
                    ' ' +
                    detail.time +
                    ', ' +
                    detail.timezone}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          'No schedules added yet'
        )}
      </td>
      <td>
        <a
          className="table-action"
          href="#"
          title="Edit"
          onClick={() => onEdit(schedule)}
        >
          <i className="fas fa-edit" />
        </a>
        <a
          className="table-action"
          href="#"
          title="Delete"
          onClick={() => onDelete(schedule)}
        >
          <i className="fas fa-trash" />
        </a>
      </td>
    </tr>
  )
}

ScheduleTableRow.propTypes = {
  schedule: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
}

export default ScheduleTableRow

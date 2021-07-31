import React from 'react'
import PropTypes from 'prop-types'

const SettingTableRow = ({ region, openEditModal }) => {
  return (
    <tr key={region.id}>
      <td>{region.name}</td>
      <td>{region.code}</td>
      <td>{region.limit}</td>
      <td>{region.created_instances}</td>
      <td>{region.show_default_ami}</td>
      <td>
        <a
          className="table-action"
          href="#"
          title="Edit Region AMI"
          onClick={() => openEditModal(region)}
        >
          <i className="fas fa-edit" />
        </a>
      </td>
    </tr>
  )
}

SettingTableRow.propTypes = {
  region: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
}

export default SettingTableRow

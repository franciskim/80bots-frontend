import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Button } from 'reactstrap'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { updateStatusBot } from 'store/bot/actions'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'

const BotTableRow = ({
  bot,
  setIsModalOpen,
  setIsDeleteModalOpen,
  setClickedBot,
}) => {
  const dispatch = useDispatch()

  const handleStatusChange = (bot) => {
    const statusName = bot.status === 'active' ? 'deactivated' : 'activated'
    const status = bot.status === 'active' ? 'inactive' : 'active'

    dispatch(updateStatusBot(bot.id, { status }))
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Bot was successfully ${statusName}!`,
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Status update failed',
        })
      )
  }

  return (
    <tr key={bot.id}>
      <td>{bot.name}</td>
      <td>
        <Badge color={bot.type === 'public' ? 'info' : 'danger'}>
          {bot.type}
        </Badge>
      </td>
      <td>{bot.description}</td>
      <td>
        {bot.tags && bot.tags.length > 0
          ? bot.tags.map((tag, idx) => (
              <Badge key={idx} pill color={'warning'}>
                {tag.name}
              </Badge>
            ))
          : '-'}
      </td>
      <td>
        <label className="custom-toggle custom-toggle-success">
          <input
            defaultChecked
            type="checkbox"
            onChange={() => handleStatusChange(bot)}
          />
          <span
            className="custom-toggle-slider rounded-circle"
            data-label-off="No"
            data-label-on="Yes"
          />
        </label>
      </td>
      <td>
        <Button
          color="primary"
          className="btn-neutral btn-round btn-icon"
          size="sm"
          onClick={() => {
            setClickedBot(bot)
            setIsModalOpen(true)
          }}
        >
          Deploy
        </Button>
        <Link href={`bot/${bot.id}`} passHref>
          <a className="table-action" href="#" title="Edit Bot">
            <i className="fas fa-edit" />
          </a>
        </Link>
        <a
          className="table-action"
          href="#"
          title="Delete Bot"
          onClick={() => {
            setClickedBot(bot)
            setIsDeleteModalOpen(true)
          }}
        >
          <i className="fas fa-trash" />
        </a>
      </td>
    </tr>
  )
}

BotTableRow.propTypes = {
  bot: PropTypes.object.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setIsDeleteModalOpen: PropTypes.func.isRequired,
  setClickedBot: PropTypes.func.isRequired,
}

export default BotTableRow

import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import {
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Badge,
} from 'reactstrap'
import { Loader80bots } from 'components/default'
import { formatTimezone } from 'lib/helpers'

import UptimeLabel from './UptimeLabel'

const OPTIONS = [
  { value: 'pending', label: 'Pending', readOnly: true },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
]

const RunningBotTableRow = ({
  botInstance,
  choiceRestoreBot,
  choiceCopyInstance,
  changeBotInstanceStatus,
  user,
}) => {
  const botNotifications = useSelector((state) => state.bot.botNotifications)

  const getServerTime = () => {
    return formatTimezone(user.timezone, botNotifications[botInstance.id].date)
  }

  const hasBotNotification = () => {
    return !!botNotifications[botInstance.id]
  }

  const getBotNotificationMessage = () => {
    const text = botNotifications[botInstance.id].notification
    return text.split('(/break/)').map((str, i) => <div key={i}>{str}</div>)
  }

  const getBotNotificationError = () => {
    return !!botNotifications[botInstance.id].error
  }

  const getBotNotificationErrorString = () => {
    return botNotifications[botInstance.id].error || ''
  }

  const getBotLastNotificationTime = () => {
    if (!botInstance.last_notification) return ''
    return formatTimezone(
      user.timezone,
      botInstance.last_notification.split('(/break/)')[0]
    )
  }

  const getBotLastNotificationString = () => {
    if (!botInstance.last_notification) return ''
    let notification = botInstance.last_notification
      .split('(/break/)')
      .map((str, i) => <div key={i}>{str}</div>)
    notification.shift()
    return notification
  }

  return (
    <>
      {botInstance.status !== 'pending' && (
        <tr
          key={botInstance.id}
          disabled={botInstance.status === 'pending'}
          className={
            botInstance.status === 'running'
              ? 'running'
              : botInstance.status === 'terminated'
              ? 'terminated'
              : 'not-running'
          }
        >
          <td>
            <Select
              options={OPTIONS}
              value={OPTIONS.find((item) => item.value === botInstance.status)}
              onChange={(option) =>
                changeBotInstanceStatus(option, botInstance.id)
              }
              isOptionDisabled={(option) => option.readOnly}
              isDisabled={botInstance.status === 'pending'}
              menuPortalTarget={document.body}
              menuPosition={'absolute'}
              menuPlacement={'bottom'}
            />
          </td>
          <td>
            {botInstance.bot_name}
            <br />
            {botInstance.container_id && (
              <Badge color="success" title="Container ID">
                {botInstance.container_id}:{botInstance.port}
              </Badge>
            )}
          </td>
          <td>
            {hasBotNotification() ? (
              !getBotNotificationError() ? (
                <span>
                  {getServerTime()}
                  <br />
                  {getBotNotificationMessage()}
                </span>
              ) : (
                <span color="danger">{getBotNotificationErrorString()}</span>
              )
            ) : (
              <span>
                {getBotLastNotificationTime()}
                <br />
                {getBotLastNotificationString()}
              </span>
            )}
          </td>
          <td>{formatTimezone(user.timezone, botInstance.launched_at)}</td>
          <td>
            <UptimeLabel
              uptime={botInstance.uptime}
              status={botInstance.status}
            />
          </td>
          <td>{botInstance.name}</td>
          <td>{botInstance.launched_by}</td>
          <td className="text-right">
            <UncontrolledDropdown>
              <DropdownToggle
                color=""
                size="sm"
                className="btn-icon-only text-light"
              >
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem href={`running/${botInstance.id}`}>
                  View
                </DropdownItem>
                {botInstance.status === 'terminated' && (
                  <DropdownItem
                    href="#pablo"
                    onClick={() => choiceRestoreBot(botInstance)}
                  >
                    Restore
                  </DropdownItem>
                )}
                {botInstance.status === 'running' && (
                  <DropdownItem href={`/botinstance/${botInstance.id}`}>
                    New Script
                  </DropdownItem>
                )}
                <DropdownItem
                  href="#pablo"
                  onClick={() => choiceCopyInstance(botInstance)}
                >
                  Clone
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      )}
      {botInstance.status === 'pending' && (
        <tr>
          <td colSpan={11} className="text-center">
            <Loader80bots
              styled={{
                width: '100px',
                height: '75px',
              }}
            />
          </td>
        </tr>
      )}
    </>
  )
}

RunningBotTableRow.propTypes = {
  botInstance: PropTypes.object.isRequired,
  choiceRestoreBot: PropTypes.func.isRequired,
  changeBotInstanceStatus: PropTypes.func.isRequired,
  choiceCopyInstance: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default RunningBotTableRow

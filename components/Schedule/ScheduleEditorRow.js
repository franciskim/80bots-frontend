import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { WEEKDAYS } from 'config'
import { Button } from 'reactstrap'
import Select from 'react-select'
import PropTypes from 'prop-types'

const STATUS_OPTIONS = [
  { value: 'stopped', label: 'Stopped' },
  { value: 'running', label: 'Running' },
]

const DAY_OPTIONS = WEEKDAYS.map((day) => ({ value: day, label: day }))

const TIME_OPTIONS = (() => {
  let startTime = dayjs().hour(0).minute(0).second(0)
  const endTime = dayjs().hour(23).minute(30).second(0)
  let timeStops = []
  while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
    let stop = startTime.format('h:mm A')
    timeStops.push({ value: stop, label: stop })
    startTime = startTime.add(30, 'minute')
  }
  return timeStops
})()

const ScheduleEditorRow = ({
  schedule,
  add,
  remove,
  updateScheduleList,
  idx,
  user,
  setError,
}) => {
  const [scheduleStatus, setScheduleStatus] = useState(null)
  const [scheduleDay, setScheduleDay] = useState(null)
  const [scheduleTime, setScheduleTime] = useState(null)

  useEffect(() => {
    setScheduleStatus(
      STATUS_OPTIONS.find((item) => item.value === schedule.status) || null
    )
    setScheduleDay(
      DAY_OPTIONS.find((item) => item.value === schedule.day) || null
    )
    setScheduleTime(
      TIME_OPTIONS.find((item) => item.value === schedule.time) || null
    )
  }, [schedule])

  const addSchedule = () => {
    if (!scheduleStatus || !scheduleDay || !scheduleTime) {
      setError('You must fill all fields')
    } else {
      //   setError(null)
      setScheduleStatus(null)
      setScheduleDay(null)
      setScheduleTime(null)
      add({
        status: scheduleStatus.value,
        day: scheduleDay.value,
        time: scheduleTime.value,
        timezone: user.timezone,
      })
    }
  }

  const changeSchedule = (status, setter, option) => {
    setter(option)
    let schedule = {
      status: scheduleStatus && scheduleStatus.value,
      day: scheduleDay && scheduleDay.value,
      time: scheduleTime && scheduleTime.value,
      timezone: user.timezone,
    }
    schedule[status] = option.value
    updateScheduleList(schedule, idx)
  }

  return (
    <tr>
      <td>
        <Select
          options={STATUS_OPTIONS}
          defaultValue={scheduleStatus}
          value={scheduleStatus}
          onChange={(option) =>
            changeSchedule('status', setScheduleStatus, option)
          }
        />
      </td>
      <td>
        <Select
          options={DAY_OPTIONS}
          defaultValue={scheduleDay}
          value={scheduleDay}
          onChange={(option) => changeSchedule('day', setScheduleDay, option)}
        />
      </td>
      <td>
        <Select
          options={TIME_OPTIONS}
          defaultValue={scheduleTime}
          value={scheduleTime}
          onChange={(option) => changeSchedule('time', setScheduleTime, option)}
        />
      </td>
      <td>
        {idx === 0 && (
          <Button
            className="btn-icon"
            color="success"
            onClick={addSchedule}
            size="sm"
          >
            <span className="btn-inner--icon mr-1">
              <i className="fa fa-plus" />
            </span>
          </Button>
        )}
        {idx > 0 && (
          <Button
            className="btn-icon"
            color="danger"
            onClick={remove}
            size="sm"
          >
            <span className="btn-inner--icon mr-1">
              <i className="fa fa-trash" />
            </span>
          </Button>
        )}
      </td>
    </tr>
  )
}

ScheduleEditorRow.propTypes = {
  schedule: PropTypes.object.isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  updateScheduleList: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
}

export default ScheduleEditorRow
